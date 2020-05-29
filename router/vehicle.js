const express = require("express");
const boom = require("boom");
const Result = require("../models/Result");
const router = express.Router();
const vehicleService = require("../services/vehicle");
const staService = require("../services/statistics");

router.get("/list", function (req, res, next) {
  console.log(req.query);
  vehicleService
    .listVehicle(req.query)
    .then((result) => {
      new Result(result, "获取列表成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err)); //boom500错误包装
    });
});

router.get("/usergpslist", function (req, res, next) {
  console.log(req.query);
  vehicleService
    .listVehicle(req.query)
    .then((result) => {
      new Result(result, "获取列表成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err)); //boom500错误包装
    });
});

router.get("/dashinfo", function (req, res, next) {
  vehicleService
    .dashInfo(req.query)
    .then((result) => {
      new Result(result, "获取dashboard面板数据成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err)); //boom500错误包装
    });
});

router.get("/data", function (req, res, next) {
  console.dir(req.query);
  vehicleService
    .alarmMsg(req.query)
    .then((result) => {
      new Result(result, "获取车辆报警信息统计成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err)); //boom500错误包装
    });
});

router.post("/addgpsinfo", function (req, res, next) {
  console.log(req.body);

  vehicleService
    .addGpsInfo(req.body)
    .then((result) => {
      if (result) {
        new Result("添加gps信息成功").success(res);
      } else {
        new Result("要添加的车辆ID未登记在本系统中").fail(res);
      }
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.delete("/delete", function (req, res, next) {
  vehicleService
    .deleteGpsInfo(req.query)
    .then((result) => {
      new Result("删除成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.get("/updatedash", function (req, res, next) {
  staService.statistics(req.query).then((result) => {
    if (result) {
      new Result(result, "更新面板数据成功").success(res);
    } else {
      new Result(result, "更新面板数据失败").fail(res);
    }
  });
});
module.exports = router;
