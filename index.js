const pug = require('pug');

const template = pug.compileFile('./src/template.pug');
const { getScheduleData, storeHTML } = require('./src/data');

process.on('unhandledRejection', up => { throw up });

const handler = async () => {
  const data = await getScheduleData();

  const html = template({ data, pretty: true });
  console.log({ html });

  const result = await storeHTML(html);
  console.log({ result });
};

module.exports = { handler };