const getStartTime = () => {
  var start = new Date();
  start.setHours(0,0,0,0);
  return start.getTime() / 1000;
};

const getEndTime = () => {
  var date = new Date();
  date.setHours(0,0,0,0);
  date.setDate(date.getDate() + 6)
  return date.getTime() / 1000;
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