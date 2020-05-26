const mssqlDb = require("../mssqlDb");

async function statistics({ date }) {
  date = date.split("-").join("");
  if (date == "201802") {
    return false;
  }
  let tableName = `tb_gpsinfo_${date}`;
  const gpsnumSql = `SELECT rows FROM sysindexes WHERE id = OBJECT_ID('dbo.${tableName}') AND indid < 2`;
  let gpsNum = await mssqlDb.querySql(gpsnumSql);

  const vehiclenumSql = `select count(distinct vehicle_id) as num from ${tableName}`;
  let vehicleNum = await mssqlDb.querySql(vehiclenumSql);

  const alarmnumSql = `select count(id) as num from ${tableName} where command_id=209`;
  let alarmNum = await mssqlDb.querySql(alarmnumSql);

  const gpsChartSql = `select count(id) as num,day(pos_time) as day from ${tableName}  group by day(pos_time)`;
  let gpsChartData = await mssqlDb.querySql(gpsChartSql);

  const vehicleChartSql = `select count(distinct vehicle_id) as num,day(pos_time) as day from ${tableName}  group by day(pos_time)`;
  let vehicleChartData = await mssqlDb.querySql(vehicleChartSql);

  const alarmChartSql = `select count(id) as num,day(pos_time) as day from ${tableName} where command_id=209 group by day(pos_time)`;
  let alarmChartData = await mssqlDb.querySql(alarmChartSql);

  let chartData = [];

  gpsChartData.forEach((gps) => {
    let obj = {};
    obj.day = gps.day;
    obj.gps = gps.num;
    let vehicleArr = vehicleChartData.filter((vehicle) => {
      return vehicle.day == gps.day;
    });
    let alarmArr = alarmChartData.filter((alarm) => {
      return alarm.day == gps.day;
    });
    if (vehicleArr.length > 0) {
      obj.vehicle = vehicleArr[0].num;
    } else {
      obj.vehicle = 0;
    }
    if (alarmArr.length > 0) {
      obj.alarm = alarmArr[0].num;
    } else {
      obj.alarm = 0;
    }
    obj.date = date;
    chartData.push(obj);
  });

  let maxDay = chartData[chartData.length - 1].day;
  let newChartData = [];
  for (let day = 1; day <= maxDay; day++) {
    let obj = {};
    let data = chartData.filter((item) => {
      return item.day == day;
    });
    if (data.length > 0) {
      newChartData.push(data[0]);
    } else {
      obj.day = day;
      obj.gps = 0;
      obj.vehicle = 0;
      obj.alarm = 0;
      obj.date = "202005";
      newChartData.push(obj);
    }
  }

  let insertChartDataSql = ``;
  newChartData.forEach(({ day, gps, vehicle, alarm, date }) => {
    insertChartDataSql = `${insertChartDataSql}insert into chartdata(day,gps,alarm,vehicle,date) values('${day}',${gps},${vehicle},${alarm},'${date}');`;
  });

  let deleteChartDataSql = `delete from chartdata where date=${date}`;
  let deleteResult = await mssqlDb.querySql(deleteChartDataSql);
  let insertResult = await mssqlDb.querySql(insertChartDataSql);
  gpsNum = gpsNum[0].rows;
  alarmNum = alarmNum[0].num;
  vehicleNum = vehicleNum[0].num;

  let deleteNuminfoSql = `delete from numinfo where date=${date}`;
  let insertNuminfoSql = `insert into numinfo(date,gps_num,alarm_num,vehicle_num) values('${date}',${gpsNum},${alarmNum},${vehicleNum})`;
  console.log(deleteNuminfoSql);
  console.log(insertNuminfoSql);
  let deleteNuminfoResult = await mssqlDb.querySql(deleteNuminfoSql);
  let insertNuminfoResult = await mssqlDb.querySql(insertNuminfoSql);

  return true;
}

function staInterval() {
  setInterval(() => {
    let time = new Date();
    let hours = time.getHours();
    console.log(hours);
    if (hours !== 0) return;
  }, 100000);
}

module.exports = {
  staInterval,
  statistics,
};
