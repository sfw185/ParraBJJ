const axios = require('axios');
const headers = { "Access-Control-Allow-Origin": "*" };
const statusCode = 200

exports.handler = async (event) => {
    if (!event.queryStringParameters) {
      return {
        headers,
        statusCode,
        body: '',
      };
    }

    const { start, end } = event.queryStringParameters;
    const url = `https://app.clubworx.com/websites/gracie_parramatta/calendar/data?start=${start}&end=${end}`
    const result = await axios.get(url, { headers: { Accept: "*/*" }});

    return {
      headers,
      statusCode,
      body: JSON.stringify(result.data),
    };
};
