var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var schedule = {};

function getStartTime() {
  var start = new Date();
  start.setHours(0,0,0,0);
  return start;
}

function getEndTime() {
  var end = getStartTime()
  end.setDate(end.getDate() + 6)
  return end;
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

function groupByStartDay(schedule) {
  return schedule.reduce(function(aggregate, current) {
    var startDate = new Date(current["start"]).toLocaleDateString("en-AU", dateOptions).split(',')[0];
    if (!aggregate[startDate]) { aggregate[startDate] = []; }
    aggregate[startDate].push(current);
    return aggregate;
  }, {});
}

function getContainer() {
  return document.getElementsByTagName('div')[0];
}

function getHeader() {
  return document.getElementsByTagName('h1')[0];
}

function processSchedule(unparsedSchedule) {
  var div = getContainer()
  div.innerHTML = "";

  schedule = groupByStartDay(unparsedSchedule)
  var header = getHeader()
  var todayIndex = Object.keys(schedule)[0];
  var todaySchedule = schedule[todayIndex];
  header.innerHTML = todayIndex;
  div.appendChild(header);

  console.log(schedule);

  for (var x = 0; x < todaySchedule.length; x++) {
    var someClass = todaySchedule[x];
    var startTime = formatDate(new Date(someClass.start));
    var p = document.createElement('p');
    p.innerHTML = [
      '<strong>' + startTime + '</strong>' + ' - ' + '<small>' + someClass.instructor_name.split(' ')[0] + '</small>',
      '<strong><em>' + someClass.title.replace('-B', ' - B') + '</em></strong>'
    ].join('<br/>');
    div.appendChild(p);
  }
}

function getSchedule() {
  var header = getHeader();
  header.innerText = "Loading...";

  var request = new XMLHttpRequest();
  var extra = "?start=" + String(Math.floor(getStartTime()/1000)) + "&end=" + String(Math.floor(getEndTime()/1000));
  request.open("GET", "https://otbpujjwh8.execute-api.ap-southeast-2.amazonaws.com/default/gracieParra" + extra, true);
  request.onreadystatechange = function () {
    if (request.readyState != 4 || request.status != 200) return;
    var schedule = JSON.parse(request.responseText)
    processSchedule(schedule);
  };
  request.send();
}