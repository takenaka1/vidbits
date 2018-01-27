const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {buildItemObject} = require('../test-utils');
const Video = require('../../models/video');

describe('POST', () => {
  describe('/videos', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    it('results in a 201 status', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      assert.equal(response.status, 201);
    });
    it('submits a video with a title and description', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      const createdVideo = await Video.findOne({});
      assert.equal(createdVideo.title, itemToCreate.title);
      assert.equal(createdVideo.description, itemToCreate.description);
    });
    it('response includes the details', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);
      assert.include(response.text, itemToCreate.title);
      assert.include(response.text, itemToCreate.description);
    });
  });
});
