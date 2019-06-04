const moment = require("moment-timezone");

const getStartTime = () => {
  return moment().tz('Australia/Sydney').startOf('day').unix();
};

const getEndTime = () => {
  return moment().tz('Australia/Sydney').startOf('day').add(6, 'days').unix();
};

const processSchedule = (unparsedSchedule) => {
  schedule = groupByStartDay(unparsedSchedule)
  var todayIndex = Object.keys(schedule)[0];
  setScheduleDay(todayIndex);
};

module.exports = {
  getStartTime,
  getEndTime,
  processSchedule
}