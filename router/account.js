const express = require("express");
const boom = require("boom");
const Result = require("../models/Result");
const router = express.Router();
const accountService = require("../services/account");

router.get("/list", function (req, res, next) {
  accountService
    .listAccount(req.query)
    .then((result) => {
      new Result(result, "获取账号列表成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err)); //boom500错误包装
    });
});

router.post("/add", function (req, res, next) {
  console.log(req.body);

  accountService
    .addAccount(req.body)
    .then((result) => {
      if (result) {
        new Result("添加账号成功").success(res);
      } else {
        new Result("用户已存在").fail(res);
      }
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.delete("/delete", function (req, res, next) {
  accountService
    .deleteAccount(req.query)
    .then((result) => {
      new Result("删除成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.post("/update", function (req, res, next) {
  console.log(req.body);

  accountService
    .updateAccount(req.body)
    .then((result) => {
      if (result) {
        new Result("修改账号数据成功").success(res);
      } else {
        new Result("账号已存在").fail(res);
      }
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});
module.exports = router;
