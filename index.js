const pug = require('pug');

const indexTemplate = pug.compileFile('./src/index.pug');
const embedTemplate = pug.compileFile('./src/embed.pug');
const plansTemplate = pug.compileFile('./src/plans.pug');

const { getScheduleData, getPlanData, storeHTML, sliceObject } = require('./src/data');

process.on('unhandledRejection', up => { throw up });

const handler = async () => {
  const scheduleData = await getScheduleData();
  const planData = await getPlanData();

  const oneWeek = sliceObject(scheduleData, 0, 7);
  const index = indexTemplate({ data: oneWeek, pretty: true });
  await storeHTML(index, 'index.html');

  const embed = embedTemplate({ data: scheduleData, pretty: true });
  await storeHTML(embed, 'embed.html');

  const plans = plansTemplate({ data: planData, pretty: true });
  await storeHTML(plans, 'plans.html');

  return { index: index.length, embed: embed.length, plans: plans.length };
};

module.exports = { handler };