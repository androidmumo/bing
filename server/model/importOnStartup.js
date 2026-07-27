const fs = require("fs");
const path = require("path");

const { installConfig } = require("../config/config");
const { logger } = require("./log4js");
const { importMySqlFile } = require("../scripts/import-mysql-sql");

const serverRoot = path.resolve(__dirname, "..");
const persistentDirectory = path.dirname(
  path.resolve(serverRoot, installConfig.databaseFile),
);

const importSqlFilesOnStartup = async () => {
  fs.mkdirSync(persistentDirectory, { recursive: true });
  const sqlFiles = fs
    .readdirSync(persistentDirectory, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".sql",
    )
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "zh-CN"));

  if (sqlFiles.length === 0) {
    logger.info("持久化目录中没有待导入的 SQL 文件");
    return [];
  }

  const results = [];
  for (const fileName of sqlFiles) {
    const filePath = path.join(persistentDirectory, fileName);
    logger.info(`开始自动导入 SQL 文件: ${fileName}`);
    const count = await importMySqlFile(filePath, { initialize: false });
    fs.unlinkSync(filePath);
    logger.info(`SQL 文件导入成功并已删除: ${fileName} (${count} 条)`);
    results.push({ fileName, count });
  }
  return results;
};

module.exports = {
  importSqlFilesOnStartup,
  persistentDirectory,
};
