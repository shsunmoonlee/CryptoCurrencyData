/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();
const axios = require('axios');
const swap = require('node-currency-swap');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

/**
 * currency exchange
 */
 app.get('/convert', async function (req, res) {
   const { from, to, amount } = req.body;
   if(!from || !to || !amount) {
     res.json({error: 'not valid request format'})
   }
   try {
     const response = await axios.get(`http://data.fixer.io/api/latest?access_key=5f571e4044e2bbfb5b6289df86dbb16d`);
     const exchangeRate = response.data.rates
     if(!exchangeRate[`${to}`] || !exchangeRate[`${from}`] ) {
       res.json({error: 'wrong currency code'})
     }
     const conversionRate = exchangeRate[`${to}`]  / exchangeRate[`${from}`]
     const conversion = conversionRate * amount
     console.log('==result', from, to, amount, conversion)
     res.json({exchangeRate, from, to, amount, conversion})
   } catch (error) {
     console.error(error);
     res.json({error})
   }
 })

app.get('/:from/:to/:amount', async function (req, res) {
  const { from, to, amount } = req.params;
  if(!from || !to || !amount) {
    res.json({error: 'not valid request format'})
  }
  try {
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=5f571e4044e2bbfb5b6289df86dbb16d`);
    const exchangeRate = response.data.rates
    if(!exchangeRate[`${to}`] || !exchangeRate[`${from}`] ) {
      res.json({error: 'wrong currency code'})
    }
    const conversionRate = exchangeRate[`${to}`]  / exchangeRate[`${from}`]
    const conversion = conversionRate * amount
    console.log('==result', from, to, amount, conversion)
    res.json({from, to, amount, conversion})
  } catch (error) {
    console.error(error);
  }
})

app.get('/cryptoCurrencies', (req, res) => {
  let currencyPrices = []
  let currencyRanks = []
  //// Get the Crypto currency Prices
  axios.get('https://api.coinmarketcap.com/v1/ticker/', {
      params: {
        convert: 'EUR',
        start: 0,
        limit: 100,
      }
    })
    .then((response) => {
      currencyPrices = response.data
    })
    .catch(function (error) {
      console.log(error);
    });
  //// Get Crypto Currency Ranks
  axios.get('https://www.cryptocompare.com/api/data/coinlist/', {
      params: {
        convert: 'EUR',
        start: 0,
        limit: 100,
      }
    })
    .then((response) => {
      // This is ranking.
      currencyRanks = response.data.map(currencyInfo => currencyInfo.sortOrder )
    })
    .catch(function (error) {
      console.log(error);
    });

  // const id = req.params.id;
  // const details = {'_id': new ObjectID(id) };
  // db.collection('notes').findOne(details, (err, item) => {
  //   if (err) {
  //     res.send({ 'error': 'An error has occured' });
  //   } else {
  //     res.send(item);
  //   }
  // });
});

app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  const details = {'_id': new ObjectID(id) };
  db.collection('notes').remove(details, (err, item) => {
    if (err) {
      res.send({ 'error': 'An error has occured' });
    } else {
      res.send('Note ' + id + ' deleted!');
    }
  });
});

app.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const details = {'_id': new ObjectID(id) };
  const note = { text: req.body.body, title: req.body.title };
  db.collection('notes').update(details, note, (err, item) => {
    if (err) {
      res.send({ 'error': 'An error has occured' });
    } else {
      res.send(item);
    }
  });
});

app.post('/notes', (req, res) => {
  const note = { text: req.body.body, title: req.body.title };
  db.collection('notes').insert(note, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occured' });
    } else {
      res.send(result.ops[0]);
    }
  });
});


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
