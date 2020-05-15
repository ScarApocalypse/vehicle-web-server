const { env } = require("./env");
const UPLOAD_PATH =
  env === "dev"
    ? "/Users/74098/upload/admin-upload-ebook"
    : "root/upload/admin-upload/ebook";
const UPLOAD_URL =
  env === "dev"
    ? "http://book.youbaobao.xyz:8089/admin-upload-ebook"
    : "http://www.book.youbaobao.xyz:8089/admin-upload-ebook";

const OLD_UPLOAD_URL =
  env === "dev"
    ? "http://book.youbaobao.xyz:8089/book/res/img"
    : "http://www.book.youbaobao.xyz:8089/book/res/img";
module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug: true,
  PWD_SALT: "admin_imooc_node",
  // 密钥
  PRIVATE_KEY: "admin_imooc_node_test_youbaobao_xyz",
  // token失效时间（秒）
  JWT_EXPIRED: 600000000 * 60,
  UPLOAD_PATH,
  MIME_TYPE_EPUB: "application/epub+zip",
  UPLOAD_URL,
  OLD_UPLOAD_URL,
};
