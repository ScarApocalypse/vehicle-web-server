const mssql = require("mssql");
const { isObject } = require("../utils");

const configStr = `mssql://sa:sa12046@localhost/VM201304_his1802`;
async function querySql(sql) {
  console.log(sql);
  try {
    let pool = await mssql.connect(configStr);
    let results = await pool.request().query(sql);

    return results.recordset;
  } catch (err) {
    // ... error checks
    throw err;
  }
}

async function queryOne(sql) {
  let results = await querySql(sql);
  if (results && results.length > 0) {
    return results[0];
  } else {
    return null;
  }
}

async function insert(model, tableName) {
  if (!isObject(model)) {
    reject(new Error("插入数据库失败,插入非数据对象"));
  } else {
    const keys = [];
    const values = [];
    Object.keys(model).forEach((key) => {
      if (model.hasOwnProperty(key)) {
        keys.push(`[${key}]`);
        values.push(`${model[key]}`);
      }
    });
    if (keys.length > 0 && values.length > 0) {
      let sql = `INSERT INTO [${tableName}] (`;
      const keysString = keys.join(",");
      const valuesString = values.join(",");
      sql = `${sql}${keysString}) VALUES (${valuesString})`;
      try {
        let pool = await mssql.connect(configStr);
        let results = await pool.request().query(sql);
        return results;
      } catch (err) {
        // ... error checks
        throw err;
      }
    }
  }
}

function and(where, key, value) {
  if (where === "") {
    return `${where} ${key}=${value}`;
  } else {
    return `${where} and ${key}=${value}`;
  }
}

function andLike(where, key, value) {
  if (where === "where") {
    return `${where} [${key}] like '%${value}%'`;
  } else {
    return `${where} and [${key}] like '%${value}%'`;
  }
}

// const obj = { name1: 13, gender: 233 };
// insert(obj, "student")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });

// queryOne("select * from student")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });

// mssql.on("error", (err) => {
//   // ... error handler
//   console.log("mssqlerr", err);
// });

module.exports = {
  querySql,
  queryOne,
  insert,
  and,
  andLike,
};
