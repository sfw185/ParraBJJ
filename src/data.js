const axios = require('axios');
const { getStartTime: start, getEndTime: end } = require('./time');

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
  const scheduleUrl = `https://app.clubworx.com/websites/pjja/calendar/data?start=${start()}&end=${end()}`;
  console.log(`Fetching schedule from ${scheduleUrl}`);

  try {
    const response = await axios.get(scheduleUrl, { headers: { Accept: 'application/json' } });
    return groupByStartDay(response.data);
  } catch (error) {
    console.error(`Error fetching schedule data: ${error.message}`);
    throw error;
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
module.exports = { getScheduleData, sliceObject };
