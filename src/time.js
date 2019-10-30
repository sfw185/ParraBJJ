const moment = require("moment-timezone");
const daysRequired = 14;

const getStartTime = () => {
  return moment().tz('Australia/Sydney').startOf('day').unix();
};

const getEndTime = () => {
  const dayOffset = daysRequired - 1;
  return moment().tz('Australia/Sydney').startOf('day').add(dayOffset, 'days').unix();
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