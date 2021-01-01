import fastify from 'fastify';
import fetch from 'node-fetch';

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

  let line = [];

  let currentHour = {};
  resultDay.current_hour[0].values.forEach((entry) => {
    let key = Object.keys(entry)[0];
    currentHour[key] = entry[key];
  });
  line.push(
    currentHour.ttt,
    currentHour.rr3,
    currentHour.pr3,
    currentHour.smb3,
  );

  result24['24hours'].forEach((item) => {
    let currentSlot = {};
    item.values.forEach((entry) => {
      let key = Object.keys(entry)[0];
      currentSlot[key] = entry[key];
    });
    line.push(
      currentSlot.ttt,
      currentSlot.rr3,
      currentSlot.pr3,
      currentSlot.smb3,
    );
  });
  return line.join(',');
  return JSON.stringify(result24, undefined, 2);
});

server.listen(8080, '0.0.0.0', (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});