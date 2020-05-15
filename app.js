const express = require("express");
const router = require("./router");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function (req, res, next) {
//   // 这里必须是Response响应的定时器【120秒】
//   res.setTimeout(120 * 1000, function () {
//     console.log("Request has timed out.");
//     return res.status(408).send("请求超时");
//   });
//   next();
// });

app.use("/", router);

const server = app.listen("18082", function () {
  const { address, port } = server.address();
  console.log(address, port);
  // console.log(`Http Server is running on http://%s:%s',address,port);
});
