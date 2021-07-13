const getFormatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTimeObj = (timeStamp) => {
  if (timeStamp < 0) {
    timeStamp = 0;
  }
  var timeObj = {
    day: Math.floor(timeStamp / 86400),
    hour: formatNumber(Math.floor((timeStamp % 86400) / 3600)),
    minute: formatNumber(Math.floor(((timeStamp % 86400) % 3600) / 60)),
    second: formatNumber(Math.floor(((timeStamp % 86400) % 3600) % 60))
  };
  return timeObj;
}
const getCountDown = (endTime) => {
  var leftTime = (endTime - (new Date()).getTime()) / 1000;
  return getTimeObj(leftTime);
}
const getCountDownList = (endTimeList) => {
  let leftTimeObjList = [];
  for (var i = 0; i < endTimeList.length; i++) {
    var endTime = endTimeList[i];
    leftTimeObjList.push(getCountDown(endTime));
  }
  return leftTimeObjList;
}



module.exports = {
  getFormatTime: getFormatTime,
  getTimeObj: getTimeObj,
  getCountDown: getCountDown,
  getCountDownList: getCountDownList
}