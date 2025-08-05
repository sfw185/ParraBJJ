const pug = require('pug');
const { promises: { writeFile } } = require('fs');
const path = require('path');

const { getScheduleData, sliceObject } = require('../src/data');

const indexTemplate = pug.compileFile(path.join(process.cwd(), 'src/index.pug'));
const embedTemplate = pug.compileFile(path.join(process.cwd(), 'src/embed.pug'));

module.exports = async (req, res) => {
  try {
    const scheduleData = await getScheduleData();

    const oneWeek = sliceObject(scheduleData, 0, 7);
    const index = indexTemplate({ data: oneWeek, pretty: true });
    await writeFile(path.join(process.cwd(), 'public', 'index.html'), index, 'utf8');

    const embed = embedTemplate({ data: scheduleData, pretty: true });
    await writeFile(path.join(process.cwd(), 'public', 'embed.html'), embed, 'utf8');

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