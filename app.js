const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const ActivityTracker = require('./ActivityTracker');
const activityTracker = new ActivityTracker('tracking.json', 1500);

activityTracker.init();

app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', async (req, res) => {
  const chartData = await activityTracker.getChartData();
  res.render('index', {
    encodedJson: encodeURIComponent(JSON.stringify(chartData))
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
