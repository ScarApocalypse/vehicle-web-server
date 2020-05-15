const express = require("express");
const multer = require("multer");
const { UPLOAD_PATH } = require("../utils/constant");
const Result = require("../models/Result");
const Book = require("../models/Book");
const boom = require("boom");
const { decoded } = require("../utils/index");
const router = express.Router();
const bookService = require("../services/book");

router.post(
  "/upload",
  multer({ dest: `${UPLOAD_PATH}/book` }).single("file"),
  function (req, res, next) {
    if (!req.file || req.file.length === 0) {
      new Result("上传电子书失败").fail(res);
    } else {
      const book = new Book(req.file);
      book
        .parse()
        .then((book) => {
          // console.log("book ", book);
          new Result(book, "上传电子书成功").success(res);
        })
        .catch((err) => {
          next(boom.badImplementation(err)); //boom500错误包装
        });
    }
  }
);

router.post("/create", function (req, res, next) {
  const decode = decoded(req);

  console.log(req.body);
  if (decode && decode.username) {
    req.body.username = decode.username;
  }
  const book = new Book(null, req.body);
  bookService
    .insertBook(book)
    .then(() => {
      new Result("添加电子书成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.post("/update", function (req, res, next) {
  const decode = decoded(req);

  if (decode && decode.username) {
    req.body.username = decode.username;
  }
  const book = new Book(null, req.body);
  bookService
    .updateBook(book)
    .then(() => {
      new Result("更新电子书成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.get("/get", function (req, res, next) {
  const { fileName } = req.query;
  if (!fileName) {
    next(boom.badRequest(new Error("参数fileName不能为空")));
  } else {
    bookService
      .getBook(fileName)
      .then((book) => {
        new Result(book, "获取图书信息成功").success(res);
      })
      .catch((err) => {
        next(boom.badImplementation(err));
      });
  }
});

router.get("/category", function (req, res, next) {
  bookService
    .getCategory()
    .then((category) => {
      new Result(category, "获取分类成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.get("/list", function (req, res, next) {
  bookService
    .listBook(req.query)
    .then(({ list, count, page, pageSize }) => {
      new Result(
        { list, count, page: +page, pageSize: +pageSize },
        "获取图书列表成功"
      ).success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

router.delete("/delete", function (req, res, next) {
  const { fileName } = req.query;
  if (!fileName) {
    next(boom.badRequest(new Error("参数fileName不能为空")));
  } else {
    bookService
      .deleteBook(fileName)
      .then(() => {
        new Result("删除图书信息成功").success(res);
      })
      .catch((err) => {
        next(boom.badImplementation(err));
      });
  }
});

router.get("/dashmsg", function (req, res, next) {
  bookService
    .getDashMsg()
    .then((count) => {
      new Result(count, "获取数据成功").success(res);
    })
    .catch((err) => {
      next(boom.badImplementation(err));
    });
});

module.exports = router;
