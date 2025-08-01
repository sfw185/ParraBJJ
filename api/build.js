const pug = require('pug');
const { promises: { writeFile } } = require('fs');
const path = require('path');

const { getScheduleData, sliceObject } = require('../src/data');

const indexTemplate = pug.compileFile('./src/index.pug');
const embedTemplate = pug.compileFile('./src/embed.pug');

module.exports = async (req, res) => {
  try {
    const scheduleData = await getScheduleData();

    const oneWeek = sliceObject(scheduleData, 0, 7);
    const index = indexTemplate({ data: oneWeek, pretty: true });
    await writeFile(path.join('./public', 'index.html'), index, 'utf8');

    const embed = embedTemplate({ data: scheduleData, pretty: true });
    await writeFile(path.join('./public', 'embed.html'), embed, 'utf8');

    res.status(200).json({
      message: 'Build completed successfully',
      files: {
        index: index.length,
        embed: embed.length
      }
    });
  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ error: error.message });
  }
};