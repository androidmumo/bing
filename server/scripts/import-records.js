const { installConfig } = require("../config/config");
const { install } = require("../model/install");
const { upgrade } = require("../model/upgrade");
const { operateDb } = require("../model/conn");

const normalizeJson = (value) => {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
};

const importRecords = async (rows, options = {}) => {
  if (!Array.isArray(rows)) {
    throw new Error("待导入数据必须是数组");
  }

  if (options.initialize !== false) {
    await install();
    await upgrade();
  }

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

  await operateDb("BEGIN IMMEDIATE");
  try {
    for (const row of rows) {
      if (!row.date) {
        throw new Error("存在缺少 date 字段的记录");
      }
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
    await operateDb("COMMIT");
  } catch (err) {
    await operateDb("ROLLBACK").catch(() => {});
    throw err;
  }

  return rows.length;
};

module.exports = {
  importRecords,
};
