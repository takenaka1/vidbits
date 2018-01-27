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

});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
