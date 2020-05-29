const mssqlDb = require("../mssqlDb");
const _ = require("lodash");
const { debug } = require("../utils/constant");

async function isUserExist(username) {
  let sql = `select username from admin_user where username='${username}'`;
  let result = await mssqlDb.querySql(sql);
  return result.length > 0 ? true : false;
}

async function listAccount(query) {
  debug && console.log(query);

  const { username, page = 1, pageSize = 20, sort = "+", role } = query;
  let tableName = `admin_user`;
  let sql = `select top ${pageSize}
  id,username,role
  from ${tableName}
  where id${sort[0] == "+" ? ">" : "<"}=
  (select ${sort[0] == "+" ? "max" : "min"}(id)
  from (select top ((${page}-1)*${pageSize}+1) id
  from ${tableName}
  ${username ? `where username like '%${username}%'` : ``}
  order by  id ${sort[0] == "+" ? "asc" : "desc"}) temp_max_ids)
  ${username ? `and username like '%${username}%'` : ``}
  ${role ? `and role = '${role}'` : ``}
  order by id ${sort[0] == "+" ? "asc" : "desc"}`;
  console.log(sql);
  let countSql = `select count(id) as count from ${tableName} where username like '%${username}%'`;
  let count = await mssqlDb.querySql(countSql);
  const list = await mssqlDb.querySql(sql);
  return { list, count: count[0].count, page, pageSize };
}

async function addAccount(model) {
  console.log(model);
  const { username, role } = model;
  let tableName = `admin_user`;

  let isExist = await isUserExist(username);
  if (isExist) return false;
  let sql = `insert into ${tableName} (username,password,role,nickname,avatar) values ('${username}','f315515a2ce0a887dd1cc0e00cdca0e4','${role}','${role}','http://106.52.133.22:8089/avatar.png')`;
  console.log(sql);
  let result = await mssqlDb.querySql(sql);

  return true;
}

async function deleteAccount({ id }) {
  console.log(id);
  let tableName = `admin_user`;
  let deleteSql = `delete from ${tableName} where id=${id}`;
  let result = await mssqlDb.querySql(deleteSql);
  return result;
}

async function updateAccount(model) {
  const { username, role, reset, id } = model;
  let tableName = `admin_user`;

  let sql = `update ${tableName}
   set username = '${username}',
   role='${role}'
   ${reset ? `,password='f315515a2ce0a887dd1cc0e00cdca0e4'` : ``}
    where id = ${+id}`;
  console.log(sql);
  let result = await mssqlDb.querySql(sql);

  return true;
}

module.exports = {
  listAccount,
  addAccount,
  deleteAccount,
  updateAccount,
  isUserExist,
};
