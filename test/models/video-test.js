const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Video model ', () => {
  it('has a string title', async () => {
    const titleAsInt = 555;
    const video = new Video({title: titleAsInt});
    assert.strictEqual(video.title, titleAsInt.toString());
  });

  it('has a string description', async () => {
    const descriptionAsInt = 999;
    const video = new Video({description: descriptionAsInt});
    assert.strictEqual(video.description, descriptionAsInt.toString());
  });

  it('Video #url is a string', async () => {
    const urlAsInt = 888;
    const video = new Video({url: urlAsInt});
    assert.strictEqual(video.url, urlAsInt.toString());
  });

  it('title is required', () => {
    const video = new Video({title: ''});
    video.validateSync();

    assert.include(video.errors.title.message, '`title` is required');
  });

  it('url is required', () => {
    const video = new Video({url: ''});
    video.validateSync();

    assert.include(video.errors.url.message, '`url` is required');
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
