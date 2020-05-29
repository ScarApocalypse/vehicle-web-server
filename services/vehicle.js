const mssqlDb = require("../mssqlDb");
const _ = require("lodash");
const { debug } = require("../utils/constant");
const { isUserExist } = require("../services/account");

async function listVehicle1(query) {
  debug && console.log(query);
  const { vehicle_id, page = 1, pageSize = 20, showAlarmOnly } = query;
  const offset = (page - 1) * pageSize;
  let sql = `SELECT id,vehicle_id,command_id,alarm_type,move_speed,nostop_time,pos_time,total_course FROM [dbo].[tb_gpsinfo]`;
  let where = "where";
  vehicle_id && (where = mssqlDb.and(where, "vehicle_id", vehicle_id));
  if (where !== "where") {
    sql = `${sql} ${where}`;
  }
  sql = `${sql} ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

  let countSql = `select count(0) as count from [dbo].[tb_gpsinfo]`;
  if (where !== "where") {
    countSql = `${countSql} ${where}`;
  } else {
    countSql = `SELECT rows FROM sysindexes WHERE id = OBJECT_ID('dbo.tb_gpsinfo') AND indid < 2`;
  }
  let count = await mssqlDb.querySql(countSql);
  const list = await mssqlDb.querySql(sql);
  if (where !== "where") {
    count = count[0].count;
  } else {
    count = count[0].rows;
  }
  console.log(count);
  return { list, count, page, pageSize };
}

async function isTableExist(tablename) {
  let sql = `Select name  From  SysObjects  Where xtype='U' And  Name='${tablename}'`;
  let result = await mssqlDb.querySql(sql);
  return result.length > 0 ? true : false;
}
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

async function listVehicle(query) {
  debug && console.log(query);

  const {
    vehicle_id,
    alarm_type,
    page = 1,
    pageSize = 20,
    sort,
    showAlarmOnly,
    date,
  } = query;
  if (date) {
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    var day = date.split("-")[2];
  }
  let time = year + month;

  let tableName = `tb_gpsinfo_${time}`;

  let isExist = await isTableExist(tableName);
  if (!isExist) {
    return { list: [], count: 0, page: 1, pageSize };
  }
  console.log(year, month, day);
  let sql = `select top ${pageSize}
  id,vehicle_id,command_id,alarm_type,move_speed,pos_time,total_course
  from ${tableName}
  where id${sort[0] == "+" ? ">" : "<"}=
  (select ${sort[0] == "+" ? "max" : "min"}(id)
  from (select top ((${page}-1)*${pageSize}+1) id
  from ${tableName}
  ${vehicle_id ? `where vehicle_id=${vehicle_id}` : ``}
  order by  id ${sort[0] == "+" ? "asc" : "desc"}) temp_max_ids)`;

  let where = "";
  vehicle_id && (where = mssqlDb.and(where, "vehicle_id", +vehicle_id));
  alarm_type && (where = mssqlDb.and(where, "alarm_type", +alarm_type));
  if (showAlarmOnly == "true") {
    where = mssqlDb.and(where, "command_id", 209);
  }
  if (date && day) {
    where = mssqlDb.and(where, "day(pos_time)", day);
  }

  if (where) {
    sql = `${sql}
    and ${where}`;
  }
  sql = `${sql}
  order by id ${sort[0] == "+" ? "asc" : "desc"}`;

  let countSql = `select count(vehicle_id) as count from [dbo].[${tableName}]`;
  if (where) {
    countSql = `${countSql}  where ${where}`;
  } else {
    countSql = `SELECT rows FROM sysindexes WHERE id = OBJECT_ID('dbo.${tableName}') AND indid < 2`;
  }
  let count = await mssqlDb.querySql(countSql);

  const list = await mssqlDb.querySql(sql);
  if (where) {
    count = count[0].count;
  } else {
    count = count[0].rows;
  }
  console.log(count);
  return { list, count, page, pageSize };
}

async function dashInfo(query) {
  let { date } = query;
  date = date.split("-").join("");
  console.log(date);

  let numinfoSql = `select * from numinfo where date=${date}`;
  let chartDataSql = `select * from chartdata where date=${date} `;
  let dashInfo = await mssqlDb.querySql(numinfoSql);

  let chartData = await mssqlDb.querySql(chartDataSql);

  return {
    dashInfo,
    chartData,
  };
}

async function alarmMsg(query) {
  let { date, id } = query;

  let tableName = `tb_gpsinfo_${date}`;

  let isExist = await isTableExist(tableName);
  if (!isExist) {
    return {
      alarm: [],
      speed: 0,
      total_course: 0,
      vehicle_id: "0",
    };
  }
  let alarmSql = `SELECT alarm_type,count(alarm_type) as num
  FROM ${tableName}
  WHERE vehicle_id=${id} and command_id=209
  GROUP BY alarm_type`;
  const alarmData = await mssqlDb.querySql(alarmSql);
  let speedSql = `select avg(move_speed) as speed from ${tableName} where vehicle_id=${id} and move_speed>0`;
  const speedData = await mssqlDb.querySql(speedSql);

  let courseSql = `select top 1 total_course from ${tableName}  where vehicle_id=${id} order by id desc `;
  const courseData = await mssqlDb.querySql(courseSql);
  console.log(courseData);
  let data = {
    vehicle_id: id,
    alarm: alarmData,
    speed: speedData[0].speed ? speedData[0].speed : 0,
    total_course: courseData.length > 0 ? courseData[0].total_course : 0,
  };
  console.log(data);
  return data;
}

async function isTableExist(tablename) {
  let sql = `Select name  From  SysObjects  Where xtype='U' And  Name='${tablename}'`;
  let result = await mssqlDb.querySql(sql);
  return result.length > 0 ? true : false;
}

async function addGpsInfo(model) {
  console.log(model);
  const {
    vehicle_id,
    command_id,
    alarm_type,
    move_speed,
    total_course,
    pos_time,
  } = model;
  let arr = model.pos_time.split("-");
  let time = arr[0] + arr[1];
  console.log(time);
  let tableName = `tb_gpsinfo_${time}`;

  let isVehicleIdExist = await isUserExist(vehicle_id);
  if (!isVehicleIdExist) {
    return false;
  }

  let isExist = await isTableExist(tableName);
  if (!isExist) {
    let createTableSql = `create table ${tableName} 
    ( 
    id int IDENTITY (1,1) PRIMARY KEY , 
    vehicle_id int,
    command_id int,
    alarm_type int,
    move_speed int,
    total_course int,
    pos_time datetime
    )`;
    let createResult = await mssqlDb.querySql(createTableSql);
  }
  let addGpsInfoSql = `insert into ${tableName} (vehicle_id,command_id,alarm_type,move_speed,total_course,pos_time) values (${+vehicle_id},${+command_id},${+alarm_type},${+move_speed},${+total_course},'${pos_time}')`;
  let result = await mssqlDb.querySql(addGpsInfoSql);

  return true;
}

async function deleteGpsInfo({ id, pos_time }) {
  let arr = pos_time.split("-");
  let tableName = `tb_gpsinfo_${arr[0]}${arr[1]}`;
  let deleteSql = `delete from ${tableName} where id=${id}`;
  let result = await mssqlDb.querySql(deleteSql);
  console.log(result);
  return result;
}

async function updateDash() {
  let time = new Date();
  let hours = time.getHours();
  console.log(hours);
  if (hours !== 0) return;
  console.log("开始统计数据");
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  if (+month < 10) month = "0" + month;
  let gpsTableName = `tb_gpsinfo_${year}${month}`;
  console.log(gpsTableName);
  const gpsnumSql = `SELECT rows FROM sysindexes WHERE id = OBJECT_ID('dbo.${gpsTableName}') AND indid < 2`;
  const vehiclenumSql = `select count(distinct vehicle_id) as num from tb_gpsinfo_201802`;
  const alarmnumSql = `select count(id) as num from tb_gpsinfo_201802 where command_id=209`;
  const gpsChartSql = `select count(id) as num,day(pos_time) as day from tb_gpsinfo_201802  group by day(pos_time)`;
  const vehicleChartSql = `select count(distinct vehicle_id) as num,day(pos_time) as day from tb_gpsinfo_201802  group by day(pos_time)`;
  const alarmChartSql = `select count(id) as num,day(pos_time) as day from tb_gpsinfo_201802 where command_id=209 group by day(pos_time)`;
}

module.exports = {
  listVehicle,
  dashInfo,
  alarmMsg,
  addGpsInfo,
  deleteGpsInfo,
  updateDash,
};
