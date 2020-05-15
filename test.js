let obj = {};

function andWhere(obj) {
  if (Object.getOwnPropertyNames(obj).length <= 0) {
    return ``;
  }
  let sql = ``;
  for (var key in obj) {
    sql = `${sql}and ${key}=${obj[key]} `;
  }
  sql = sql.replace("and", "where");
  return sql;
}

andWhere(obj);
