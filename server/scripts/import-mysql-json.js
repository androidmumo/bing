// 将从旧 MySQL bing 表导出的 JSON 数组导入内置 SQLite。
const fs = require("fs");
const path = require("path");

const { importRecords } = require("./import-records");

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("用法: pnpm import:mysql-json <bing-export.json>");
  process.exit(1);
}

const main = async () => {
  const content = fs.readFileSync(path.resolve(inputPath), "utf8");
  const parsed = JSON.parse(content);
  const rows = Array.isArray(parsed) ? parsed : parsed.rows || parsed.data;

  if (!Array.isArray(rows)) {
    throw new Error("导入文件必须是 JSON 数组，或包含 rows/data 数组");
  }

  const count = await importRecords(rows);
  console.log(`导入完成：${count} 条记录`);
};

main().catch((err) => {
  console.error("导入失败：", err.data?.message || err.message || err);
  process.exit(1);
});
