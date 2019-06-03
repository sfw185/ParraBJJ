var dateOptions = { weekday: 'long' };

const fixDateFormat = (someClass) => {
  var date = new Date(someClass["start"]);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  someClass.start = hours + ':' + minutes + ampm;
};

const groupByStartDay = (schedule) =>
  schedule.reduce((aggregate, current) => {
    const startDate = new Date(current["start"]).toLocaleDateString("en-AU", dateOptions).split(',')[0];
    if (!aggregate[startDate]) { aggregate[startDate] = []; }
    fixDateFormat(current);
    aggregate[startDate].push(current);
    return aggregate;
  }, {});

  module.exports = { groupByStartDay };