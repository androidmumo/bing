// 将从旧 MySQL bing 表导出的 JSON 数组导入内置 SQLite。
const fs = require("fs");
const path = require("path");

const { installConfig } = require("../config/config");
const { install } = require("../model/install");
const { upgrade } = require("../model/upgrade");
const { operateDb } = require("../model/conn");

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("用法: pnpm import:mysql <bing-export.json>");
  process.exit(1);
}

const normalizeJson = (value) => {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
};

const main = async () => {
  const content = fs.readFileSync(path.resolve(inputPath), "utf8");
  const parsed = JSON.parse(content);
  const rows = Array.isArray(parsed) ? parsed : parsed.rows || parsed.data;

  if (!Array.isArray(rows)) {
    throw new Error("导入文件必须是 JSON 数组，或包含 rows/data 数组");
  }

  await install();
  await upgrade();

  const sql = `
    INSERT INTO ${installConfig.databaseTable}
      (id, title, copyright, date, base64, url, color, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
    ON CONFLICT(date) DO UPDATE SET
      title = excluded.title,
      copyright = excluded.copyright,
      base64 = excluded.base64,
      url = excluded.url,
      color = excluded.color,
      timestamp = excluded.timestamp;
  `;

  for (const row of rows) {
    await operateDb(sql, [
      row.id ?? null,
      row.title ?? null,
      row.copyright ?? null,
      row.date,
      row.base64 ?? null,
      normalizeJson(row.url),
      normalizeJson(row.color),
      row.timestamp ?? null,
    ]);
  }

  console.log(`导入完成：${rows.length} 条记录`);
};

main().catch((err) => {
  console.error("导入失败：", err.data?.message || err.message || err);
  process.exit(1);
});
