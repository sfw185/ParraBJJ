const pug = require('pug');
const { promises: { writeFile, mkdir } } = require('fs');
const path = require('path');

const { getScheduleData, sliceObject } = require('../src/data');

const indexTemplate = pug.compileFile('./src/index.pug');
const embedTemplate = pug.compileFile('./src/embed.pug');

const build = async () => {
  try {
    // Ensure public directory exists
    await mkdir('./public', { recursive: true });

    console.log('Fetching data...');
    const scheduleData = await getScheduleData();

    console.log('Building index.html...');
    const oneWeek = sliceObject(scheduleData, 0, 7);
    const index = indexTemplate({ data: oneWeek, pretty: true });
    await writeFile(path.join('./public', 'index.html'), index, 'utf8');

    console.log('Building embed.html...');
    const embed = embedTemplate({ data: scheduleData, pretty: true });
    await writeFile(path.join('./public', 'embed.html'), embed, 'utf8');

    console.log('Build completed successfully!');
    console.log({
      index: index.length,
      embed: embed.length
    });
  } catch (error) {
    console.error('Build error:', error);
    process.exit(1);
  }
};

build();