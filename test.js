// let gpsChartData = [
//   { num: 1, day: 3 },
//   { num: 1, day: 5 },
//   { num: 1, day: 12 },
//   { num: 2, day: 16 },
//   { num: 1, day: 20 },
//   { num: 2, day: 26 },
// ];
// let vehicleChartData = [
//   { num: 1, day: 3 },
//   { num: 1, day: 5 },
//   { num: 1, day: 12 },
//   { num: 2, day: 16 },
//   { num: 1, day: 20 },
//   { num: 1, day: 26 },
// ];
// let alarmChartData = [
//   { num: 1, day: 3 },
//   { num: 1, day: 12 },
//   { num: 2, day: 16 },
//   { num: 2, day: 26 },
// ];

// let chartData = [];

// gpsChartData.forEach((gps) => {
//   let obj = {};
//   obj.day = gps.day;
//   obj.gps = gps.num;
//   let vehicleArr = vehicleChartData.filter((vehicle) => {
//     return vehicle.day == gps.day;
//   });
//   console.log("vehicle");
//   console.log(vehicleArr);
//   let alarmArr = alarmChartData.filter((alarm) => {
//     return alarm.day == gps.day;
//   });
//   console.log("alarm");
//   console.log(alarmArr);

//   if (vehicleArr.length > 0) {
//     obj.vehicle = vehicleArr[0].num;
//   } else {
//     obj.vehicle = 0;
//   }
//   if (alarmArr.length > 0) {
//     obj.alarm = alarmArr[0].num;
//   } else {
//     obj.alarm = 0;
//   }
//   obj.date = 202005;
//   chartData.push(obj);
// });

// console.log(chartData);

let chartData = [
  { day: 3, gps: 1, vehicle: 1, alarm: 1, date: "202005" },
  { day: 5, gps: 1, vehicle: 1, alarm: 0, date: "202005" },
  { day: 12, gps: 1, vehicle: 1, alarm: 1, date: "202005" },
  { day: 16, gps: 2, vehicle: 2, alarm: 2, date: "202005" },
  { day: 20, gps: 1, vehicle: 1, alarm: 0, date: "202005" },
  { day: 22, gps: 1, vehicle: 1, alarm: 1, date: "202005" },
  { day: 26, gps: 2, vehicle: 1, alarm: 2, date: "202005" },
];

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
