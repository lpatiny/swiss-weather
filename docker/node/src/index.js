import DEBUG from 'debug';
import fastify from 'fastify';
import fetch from 'node-fetch';

import mapping from './symbols/mapping.json';

const debug = DEBUG('weather');

const server = fastify({ logger: true });

server.get('/forecast24', async (request, reply) => {
  const query = request.query;
  const latitude = query.latitude ? Number(query.latitude) : 46.5173189;
  const longitude = query.longitude ? Number(query.longitude) : 6.545778;

  let response = await fetch(
    'https://api.srgssr.ch/oauth/v1/accesstoken?grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic WmtmRWlYTDhyUldzbTJoY202UzRqR2hwZUVPZjNEOUE6anNzWjhOVXNSTDlQNjQzcQ',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': '0',
      },
    },
  );
  let credentials = await response.json();

  debug('credentials', credentials);

  response = await fetch(
    `https://api.srgssr.ch/forecasts/v1.0/weather/24hour?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': '0',
      },
    },
  );
  let result24 = await response.json();
  debug('result24', result24);
  response = await fetch(
    `https://api.srgssr.ch/forecasts/v1.0/weather/current?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': '0',
      },
    },
  );
  let resultDay = await response.json();
  debug('resultDay', resultDay);
  let line = [];

  if (resultDay.fault || result24.fault || !resultDay.current_hour || !result24['24hours']) {
    debug('FAULT')
    for (let i = 0; i < 9; i++) {
      line.push(0, 0, 0, 0);
    }
  } else {
    let currentHour = {};
    resultDay.current_hour[0].values.forEach((entry) => {
      let key = Object.keys(entry)[0];
      currentHour[key] = entry[key];
    });

    line.push(
      currentHour.ttt,
      currentHour.rr3 || '0',
      currentHour.smb3,
      mapping[currentHour.smb3],
    );

    result24['24hours'].forEach((item) => {
      let currentSlot = {};
      item.values.forEach((entry) => {
        let key = Object.keys(entry)[0];
        currentSlot[key] = entry[key];
      });
      line.push(
        currentSlot.ttt,
        currentSlot.rr3 || '0',
        currentSlot.smb3,
        mapping[currentSlot.smb3],
      );
    });
  }

  response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`,
  );
  let resultSunrise = await response.json();
  let sunrise = new Date(resultSunrise.results.sunrise);
  let sunset = new Date(resultSunrise.results.sunset);

  let intlDateObj = new Intl.DateTimeFormat('fr-CH', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  let sunriseString = intlDateObj.format(sunrise);
  let sunsetString = intlDateObj.format(sunset);
  line.push(sunriseString.replace(/.* /, ''));
  line.push(sunsetString.replace(/.* /, ''));

  return line.join(',');
});

server.listen(8080, '0.0.0.0', (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});
