// 直接读取 mysqldump SQL 文件，并将 bing 表数据导入内置 SQLite。
const fs = require("fs");
const path = require("path");

const { installConfig } = require("../config/config");
const { importRecords } = require("./import-records");

const currentColumns = [
  "id",
  "title",
  "copyright",
  "date",
  "base64",
  "url",
  "color",
  "timestamp",
];
const legacyColumns = [
  "id",
  "copyright",
  "date",
  "base64",
  "url",
  "color",
  "timestamp",
];
const allowedColumns = new Set(currentColumns);

const splitStatements = (sql) => {
  const statements = [];
  let current = "";
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < sql.length; index++) {
    const char = sql[index];
    const next = sql[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      current += char;
      if (char === "\\" && quote !== "`" && next != null) {
        current += next;
        index++;
      } else if (char === quote) {
        if (next === quote) {
          current += next;
          index++;
        } else {
          quote = null;
        }
      }
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
    } else if (char === "#") {
      lineComment = true;
    } else if (char === "-" && next === "-" && /\s/.test(sql[index + 2] || "")) {
      lineComment = true;
      index++;
    } else if (char === "/" && next === "*") {
      blockComment = true;
      index++;
    } else if (char === ";") {
      if (current.trim()) statements.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
};

const extractParenthesized = (source, startIndex) => {
  let depth = 0;
  let quote = null;

  for (let index = startIndex; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (quote) {
      if (char === "\\" && quote !== "`" && next != null) {
        index++;
      } else if (char === quote) {
        if (next === quote) index++;
        else quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
    } else if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
      if (depth === 0) {
        return {
          content: source.slice(startIndex + 1, index),
          endIndex: index + 1,
        };
      }
    }
  }
  throw new Error("SQL 中存在未闭合的括号");
};

const splitValues = (source) => {
  const values = [];
  let current = "";
  let depth = 0;
  let quote = null;

  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (quote) {
      current += char;
      if (char === "\\" && quote !== "`" && next != null) {
        current += next;
        index++;
      } else if (char === quote) {
        if (next === quote) {
          current += next;
          index++;
        } else {
          quote = null;
        }
      }
    } else if (char === "'" || char === '"') {
      quote = char;
      current += char;
    } else if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

const decodeString = (value) => {
  let result = "";
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    const next = value[index + 1];
    if (char === "'" && next === "'") {
      result += "'";
      index++;
    } else if (char === "\\" && next != null) {
      const replacements = {
        "0": "\0",
        b: "\b",
        n: "\n",
        r: "\r",
        t: "\t",
        Z: "\x1a",
      };
      result += Object.prototype.hasOwnProperty.call(replacements, next)
        ? replacements[next]
        : next;
      index++;
    } else {
      result += char;
    }
  }
  return result;
};

const decodeValue = (rawValue) => {
  const value = rawValue.trim().replace(/^_(?:binary|utf8mb4?|latin1)\s+/i, "");
  if (/^NULL$/i.test(value)) return null;
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) {
    return Number(value);
  }
  if (/^0x[0-9a-f]+$/i.test(value)) {
    return Buffer.from(value.slice(2), "hex").toString("utf8");
  }
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return decodeString(value.slice(1, -1));
  }
  throw new Error(`不支持的 MySQL 值: ${value.slice(0, 80)}`);
};

const normalizeIdentifier = (identifier) =>
  identifier.trim().replace(/^`|`$/g, "").toLowerCase();

const parseInsert = (statement) => {
  const header = statement.match(
    /^(?:INSERT|REPLACE)\s+(?:IGNORE\s+)?INTO\s+((?:`[^`]+`|[\w$]+)(?:\s*\.\s*(?:`[^`]+`|[\w$]+))?)/i,
  );
  if (!header) return [];

  const tableName = normalizeIdentifier(header[1].split(".").pop());
  if (tableName !== installConfig.databaseTable.toLowerCase()) return [];

  let remainder = statement.slice(header[0].length).trim();
  let columns = null;
  if (remainder.startsWith("(")) {
    const columnBlock = extractParenthesized(remainder, 0);
    columns = columnBlock.content.split(",").map(normalizeIdentifier);
    const invalidColumn = columns.find((column) => !allowedColumns.has(column));
    if (invalidColumn) {
      throw new Error(`SQL 包含不支持的字段: ${invalidColumn}`);
    }
    remainder = remainder.slice(columnBlock.endIndex).trim();
  }

  const valuesKeyword = remainder.match(/^VALUES?\b/i);
  if (!valuesKeyword) return [];
  remainder = remainder.slice(valuesKeyword[0].length).trim();

  const rows = [];
  let offset = 0;
  while (offset < remainder.length) {
    while (/[\s,]/.test(remainder[offset] || "")) offset++;
    if (remainder[offset] !== "(") break;
    const rowBlock = extractParenthesized(remainder, offset);
    const values = splitValues(rowBlock.content).map(decodeValue);
    const rowColumns =
      columns ||
      (values.length === currentColumns.length ? currentColumns : legacyColumns);
    if (values.length !== rowColumns.length) {
      throw new Error(
        `字段数量不匹配：期望 ${rowColumns.length}，实际 ${values.length}`,
      );
    }
    rows.push(
      Object.fromEntries(rowColumns.map((column, index) => [column, values[index]])),
    );
    offset = rowBlock.endIndex;
  }
  return rows;
};

const parseMySqlDump = (sql) =>
  splitStatements(sql).flatMap((statement) => parseInsert(statement));

const importMySqlFile = async (inputPath, options = {}) => {
  const content = fs.readFileSync(path.resolve(inputPath), "utf8");
  const rows = parseMySqlDump(content);
  if (rows.length === 0) {
    throw new Error(`SQL 文件中没有找到 ${installConfig.databaseTable} 表数据`);
  }
  return importRecords(rows, options);
};

const main = async () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error("用法: pnpm import:mysql <mysql-dump.sql>");
  }
  const count = await importMySqlFile(inputPath);
  console.log(`导入完成：${count} 条记录`);
};

if (require.main === module) {
  main().catch((err) => {
    console.error("导入失败：", err.data?.message || err.message || err);
    process.exit(1);
  });
}

module.exports = {
  importMySqlFile,
  parseMySqlDump,
};
