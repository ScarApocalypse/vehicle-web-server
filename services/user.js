const { querySql, queryOne, update } = require("../mssqlDb");

function login(username, password) {
  return querySql(
    `select * from admin_user where username='${username}' and password='${password}'`
  );
}

function findUser(username) {
  return queryOne(
    `select id,username,nickname,role,avatar from admin_user where username='${username}'`
  );
}

function modifyPW(data) {
  return querySql(
    `update admin_user set password='${data.password}' where username='${data.username}'`
  );
}
module.exports = {
  login,
  findUser,
  modifyPW,
};
