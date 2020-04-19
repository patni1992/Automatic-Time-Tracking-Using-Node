const activeWin = require('active-win');
const _ = require('lodash');
const fs = require('fs-extra');

class ActivityTracker {
  constructor (filePath, interval) {
    this.filePath = filePath;
    this.interval = interval;
    this.start = null;
    this.app = null;
  }

  async getChartData () {
    const data = await fs.readJson(this.filePath);
    const formatedData = [];

    Object.entries(data).forEach(([key, val]) => {
      const data = [];
      let totalTimeOnApp = 0;

      Object.entries(val).forEach(([prop, meta]) => {
        totalTimeOnApp += meta.time;
        data.push({
          name: prop,
          url: meta.url,
          time: meta.time
        });
      });

      formatedData.push({
        title: key,
        total: Math.floor(totalTimeOnApp),
        data
      });
    });

    return formatedData;
  }

  async storeData () {
    const content = await fs.readJson(this.filePath);
    const time = {
      start: this.start,
      end: new Date()
    };
    const { url, owner: { name }, title } = this.app;

    _.defaultsDeep(content, { [name]: { [title]: { time: 0, url } } });

    content[name][title].time += Math.abs(time.start - time.end) / 1000;

    await fs.writeJson(this.filePath, content, { spaces: 2 });
  }

  async init () {
    const fileExists = await fs.pathExists(this.filePath);

    if (!fileExists) {
      await fs.writeJson(this.filePath, {});
    }

    this.track();
  }

  track () {
    setInterval(async () => {
      const window = await activeWin();

      if (!this.app) {
        this.start = new Date();
        this.app = window;
      }

      if (window.title !== this.app.title) {
        await this.storeData();
        this.app = null;
      }
    }, this.interval);
  }
}

module.exports = ActivityTracker;
