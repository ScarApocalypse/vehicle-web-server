let gpsChartData = [{ num: 1, day: 14 }];
let vehicleChartData = [];
let alarmChartData = [];

let chartData = [];

gpsChartData.forEach((gps) => {
  let obj = {};
  obj.day = gps.day;
  obj.gps = gps.num;
  let vehicleArr = vehicleChartData.filter((vehicle) => {
    return vehicle.day == gps.day;
  });
  console.log("vehicle");
  console.log(vehicleArr);
  let alarmArr = alarmChartData.filter((alarm) => {
    return alarm.day == gps.day;
  });
  console.log("alarm");
  console.log(alarmArr);

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
  obj.date = 202005;
  chartData.push(obj);
});

console.log(chartData);

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
console.log(newChartData);
