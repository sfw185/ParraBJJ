const fs = require('fs');
const pug = require('pug');
const axios = require('axios');

const template = pug.compileFile('template.pug');
const { groupByStartDay } = require('./schedule.js');
const { getStartTime: start, getEndTime: end } = require('./time.js');

process.on('unhandledRejection', up => { throw up });

const doTheThing = async () => {
  const url = `https://app.clubworx.com/websites/gracie_parramatta/calendar/data?start=${start()}&end=${end()}`
  const { data } = await axios.get(url, { headers: { Accept: "*/*" }});
  const grouped = groupByStartDay(data);

  const html = template({ data: grouped, pretty: true });
  fs.writeFile('public/index.html', html, () => {
    console.log('Done');
  });
};

exports.handler = doTheThing

doTheThing();
