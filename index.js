const pug = require('pug');

const indexTemplate = pug.compileFile('./src/index.pug');
const embedTemplate = pug.compileFile('./src/embed.pug');

const { getScheduleData, storeHTML, sliceObject } = require('./src/data');

process.on('unhandledRejection', up => { throw up });

const handler = async () => {
  const data = await getScheduleData();

  const oneWeek = sliceObject(data, 0, 7);
  const index = indexTemplate({ data: oneWeek, pretty: true });
  await storeHTML(index, 'index.html');

  const embed = embedTemplate({ data, pretty: true });
  await storeHTML(embed, 'embed.html');

  return { index: index.length, embed: embed.length };
};

module.exports = { handler };