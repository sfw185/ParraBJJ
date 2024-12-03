const { promises: { writeFile } } = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');
const { getStartTime: start, getEndTime: end } = require('./time');

// Initialize AWS S3 with proper configuration
const s3 = new AWS.S3({ region: 'us-west-2' });

// Cache S3 bucket name from environment variables
const S3_BUCKET = process.env.S3_BUCKET?.trim() || null;

// Function to group schedule by start day
const groupByStartDay = (schedule) => {
  return schedule.reduce((aggregate, current) => {
    const startDate = new Date(current.start).toLocaleDateString('en-AU', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    if (!aggregate[startDate]) {
      aggregate[startDate] = [];
    }
    fixDates(current);
    aggregate[startDate].push(current);
    return aggregate;
  }, {});
};

// Function to fetch schedule data
const getScheduleData = async () => {
  const scheduleUrl = `https://app.clubworx.com/websites/gracie-parramatta/calendar/data?start=${start()}&end=${end()}`;
  console.log(`Fetching schedule from ${scheduleUrl}`);

  try {
    const response = await axios.get(scheduleUrl, { headers: { Accept: 'application/json' } });
    return groupByStartDay(response.data);
  } catch (error) {
    console.error(`Error fetching schedule data: ${error.message}`);
    throw error;
  }
};

// Function to fetch plan data
const getPlanData = async () => {
  const publicPageUrl = 'https://app.clubworx.com/websites/gracie-parramatta/memberships';
  console.log(`Fetching plans from ${publicPageUrl}`);

  try {
    const response = await axios.get(publicPageUrl);
    const $ = cheerio.load(response.data);

    const planData = [];

    $('.worx-site-plan').each((i, el) => {
      const plan = {};

      // Extract plan name
      plan.name = $(el).find('.worx-plan-name').text().trim();

      // Extract privileges
      plan.privileges = [];
      $(el).find('.worx-plan-privileges li').each((index, li) => {
        plan.privileges.push($(li).text().trim());
      });

      // Extract price amount and duration
      plan.amount = $(el).find('.worx-plan-amount').text().trim();
      plan.duration = $(el).find('.worx-plan-duration').text().trim();

      planData.push(plan);
    });

    return planData;
  } catch (error) {
    console.error(error);
  }
};

// Function to store HTML locally
const storeLocal = async (html, filename) => {
  try {
    await writeFile(`./public/${filename}`, html, 'utf8');
    console.log(`Successfully stored ${filename} locally.`);
  } catch (error) {
    console.error(`Error storing ${filename} locally: ${error.message}`);
    throw error;
  }
};

// Function to store HTML remotely on S3
const storeRemote = async (html, filename) => {
  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET environment variable is not set.');
  }

  const params = {
    Body: html,
    ContentType: 'text/html',
    Bucket: S3_BUCKET,
    Key: filename,
  };

  try {
    await s3.putObject(params).promise();
    console.log(`Successfully stored ${filename} on S3 bucket ${S3_BUCKET}.`);
  } catch (error) {
    console.error(`Error storing ${filename} on S3: ${error.message}`);
    throw error;
  }
};

// Function to decide where to store HTML
const storeHTML = async (html, filename) => {
  console.log(`Storing ${filename}...`);
  if (S3_BUCKET) {
    return storeRemote(html, filename);
  } else {
    return storeLocal(html, filename);
  }
};

// Function to format time to 12-hour format with am/pm
const fixDateFormat = (rawDate) => {
  const date = new Date(rawDate);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

// Function to fix dates in the schedule object
const fixDates = (someClass) => {
  someClass.start = fixDateFormat(someClass.start);
  someClass.end = fixDateFormat(someClass.end);
};

// Function to slice an object based on start index and count
const sliceObject = (object, startIndex, count) => {
  return Object.fromEntries(Object.entries(object).slice(startIndex, startIndex + count));
};

// Export necessary functions
module.exports = { getScheduleData, getPlanData, storeHTML, sliceObject };
