// 图片处理模块

// 导入模块
const { logger } = require("./log4js"); // 日志模块
const { eventBus } = require("./eventBus"); // 事件总线

// 导入第三方模块
const dayjs = require("dayjs");
const Jimp = require("jimp");
const Vibrant = require("node-vibrant");

// ------ 逻辑函数 start ------
// 16进制转换
function componentToHex(num) {
  var hex = num.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// 将rgb颜色转换为16进制颜色
function rgbToHex([r, g, b]) {
  return (
    "#" +
    componentToHex(Math.round(r)) +
    componentToHex(Math.round(g)) +
    componentToHex(Math.round(b))
  );
}
// ------ 逻辑函数 end ------

// 处理图片 灰度
const processImageGrey = function (saveDir, { quality }) {
  Jimp.read(`${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd.jpg`)
    .then((img) => {
      return img
        .greyscale()
        .quality(quality)
        .write(
          `${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd_greyscale.jpg`,
          () => {
            logger.info("图片处理成功: 灰度");
          }
        );
    })
    .catch((err) => {
      eventBus.emit("on-error", "processImageGrey");
      logger.error("图片处理失败: 灰度 " + err);
    });
};

// 处理图片 高斯模糊
const processImageGauss = function (saveDir, { pixels, quality }) {
  Jimp.read(`${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd.jpg`)
    .then((img) => {
      return img
        .quality(quality)
        .gaussian(pixels)
        .write(
          `${saveDir}/${dayjs().format(
            "YYYY-MM-DD"
          )}_hd_gaussian_${pixels}.jpg`,
          () => {
            logger.info("图片处理成功: 高斯模糊");
          }
        );
    })
    .catch((err) => {
      eventBus.emit("on-error", "processImageGauss");
      logger.error("图片处理失败: 高斯模糊 " + err);
    });
};

// 处理图片 缩放 质量
const processImageResize = function (saveDir, { width, height, quality }) {
  Jimp.read(`${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd.jpg`)
    .then((img) => {
      return img
        .resize(width, height)
        .quality(quality)
        .write(
          `${saveDir}/${dayjs().format(
            "YYYY-MM-DD"
          )}_hd_thumbnail_${width}_${height}.jpg`,
          () => {
            logger.info(`图片处理成功: 缩放 width:${width} height:${height}`);
          }
        );
    })
    .catch((err) => {
      eventBus.emit("on-error", "processImageResize");
      logger.error("图片处理失败: 缩放 " + err);
    });
};

// 处理图片 base64编码
const getImageBase64 = function (saveDir, { width, height, quality }) {
  return new Promise((resolve, reject) => {
    Jimp.read(`${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd.jpg`)
      .then((img) => {
        //   console.log(img.hash())
        return img
          .resize(width, height) // set greyscale
          .quality(quality)
          .getBase64(Jimp.AUTO, (err, base64Image) => {
            logger.info("图片处理成功: base64");
            resolve(base64Image);
          });
      })
      .catch((err) => {
        eventBus.emit("on-error", "getImageBase64");
        logger.error("图片处理失败: base64 " + err);
        reject(err);
      });
  });
};

// 获取图片的主要颜色
const getImageMainColor = function (saveDir) {
  return new Promise((resolve, reject) => {
    Vibrant.from(
      `${saveDir}/${dayjs().format("YYYY-MM-DD")}_hd.jpg`
    ).getPalette((err, palette) => {
      if (err) {
        eventBus.emit("on-error", "getImageMainColor");
        logger.error("图片处理失败: 获取主要颜色 " + err);
        reject(err);
      }
      const paletteObj = {};
      Object.keys(palette).map((item) => {
        paletteObj[item] = rgbToHex(palette[item].rgb);
      });
      logger.info("图片处理成功: 获取主要颜色");
      resolve(paletteObj);
    });
  });
};

module.exports = {
  processImageGrey,
  processImageGauss,
  processImageResize,
  getImageBase64,
  getImageMainColor,
};
