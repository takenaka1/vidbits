const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {buildItemObject, seedItemToDatabase, parseTextFromHTML, generateRandomUrl} = require('../test-utils');
const Video = require('../../models/video');
const {jsdom} = require('jsdom');

describe('POST', () => {
  describe('/videos', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    it('results in a 302 status', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      assert.equal(response.status, 302);
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
        .send(itemToCreate)
        .redirects(1);

      assert.include(response.text, itemToCreate.title);
      assert.include(response.text, itemToCreate.description);
      assert.include(response.text, itemToCreate.url);
    });

    it('does not save a video with an empty title', async () => {
      const itemToCreate = {title: '', description: 'description', url: generateRandomUrl()};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      const createdVideo = await Video.find({});
      assert.equal(createdVideo.length, 0)
    });

    it('responds with a 400 to a video with an empty title', async () => {
      const itemToCreate = {title: '', description: 'description', url: generateRandomUrl()};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      assert.equal(response.status, 400);
    });

    it('renders the video form when the title is missing', async () => {
      const itemToCreate = {title: '', description: 'description', url: generateRandomUrl()};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      const element = jsdom(response.text).querySelector('form');
      assert.notEqual(element, null);
      assert.include(element.textContent, 'Save a video');
    });

    it('response text includes an error message when the title is missing', async () => {
      const itemToCreate = {title: '', description: 'description', url: generateRandomUrl()};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      assert.include(parseTextFromHTML(response.text, '.input-form span'), '`title` is required');
    });

    it('preserves the other field values', async () => {
      const itemToCreate = {title: '', description: 'description1', url: generateRandomUrl('example.com')};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      const url = jsdom(response.text).querySelector('[name="url"]');
      assert.equal(url.value, itemToCreate.url);
      assert.include(response.text, itemToCreate.description);
    });

    it('redirects to the new Video show page', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate);

      assert.match(response.headers.location, /\/videos\/\w*$/);
    });

    it('saves a Video document', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate)
        .redirects(1);

      const video = await Video.findOne({});
      const {title, description, url} = itemToCreate;
      assert.include(video, {title, description, url});
    });

    it('renders the validation error message when the URL is missing', async () => {
      const itemToCreate = {title: 'title', description: 'description', url: ''};
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(itemToCreate)
        .redirects(1);

      assert.include(parseTextFromHTML(response.text, 'body'), '`url` is required');
    });
  });

  describe('/videos/:id/updates', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    it('updates the record', async () => {
      const itemToCreate = await seedItemToDatabase();

      const title = 'newtitle';
      const description = 'newdescription';
      const url = generateRandomUrl('newexample.com');

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/updates`)
        .type('form')
        .send({title, description, url});

      const updatedItem = await Video.findOne({_id: itemToCreate._id});
      assert.include(updatedItem, {title, description, url});
    });

    it('redirects to the show page', async () => {
      const itemToCreate = await seedItemToDatabase();

      const title = 'newtitle';
      const description = 'newdescription';
      const url = generateRandomUrl('newexample.com');

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/updates`)
        .type('form')
        .send({title, description, url});

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/${itemToCreate._id}`);
    });

    it('does not save the invalid record', async () => {
      const itemToCreate = await seedItemToDatabase();

      const title = '';
      const description = 'newdescription';
      const url = generateRandomUrl('newexample.com');

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/updates`)
        .type('form')
        .send({title, description, url});

      const updatedItem = await Video.findOne({_id: itemToCreate._id});
      assert.equal(updatedItem.title, itemToCreate.title);
      assert.equal(updatedItem.description, itemToCreate.description);
      assert.equal(updatedItem.url, itemToCreate.url);
    });

    it('responds with a 400 when the record is invalid', async () => {
      const itemToCreate = await seedItemToDatabase();

      const title = '';
      const description = 'newdescription';
      const url = generateRandomUrl('newexample.com');

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/updates`)
        .type('form')
        .send({title, description, url});

      assert.equal(response.status, 400);
    });

    it('renders Edit form when the record is invalid', async () => {
      const itemToCreate = await seedItemToDatabase();

      const title = '';
      const description = 'newdescription';
      const url = itemToCreate.url;

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/updates`)
        .type('form')
        .send({title, description, url});

      assert.equal(jsdom(response.text).querySelector('[name="url"]').value, itemToCreate.url);
    });
  });

  describe('/videos/:id/deletions', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    it('removes the record', async () => {
      const itemToCreate = await seedItemToDatabase();

      const response = await request(app)
        .post(`/videos/${itemToCreate._id}/deletions`);

      const deletedItem = await Video.find({_id: itemToCreate._id});
      assert.equal(deletedItem.length, 0);
    });

  });
});

describe('GET', () => {
  describe('/videos', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    it('renders existing Videos', async () => {
      const itemToCreate = await seedItemToDatabase();
      const response = await request(app)
        .get('/videos')
        .redirects(1);

      const iFrame = jsdom(response.text).querySelector('iframe');
      assert.equal(iFrame.src, itemToCreate.url);
      assert.include(parseTextFromHTML(response.text, '#videos-container .video-title'), itemToCreate.title);
    });
  });

  describe('/videos/:id', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    it('renders the Video', async () => {
      const itemToCreate = await seedItemToDatabase();
      const response = await request(app)
        .get('/videos/itemToCreate._id')

      const iFrame = jsdom(response.text).querySelector('iframe');
      assert.equal(iFrame.src, itemToCreate.url);
      assert.include(parseTextFromHTML(response.text, 'h1'), itemToCreate.title);
    });
  });

  describe('/videos/:id/edit', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);
    it('renders a form for the Video', async () => {
      const itemToCreate = await seedItemToDatabase({title: 'title111'});
      const response = await request(app)
        .get(`/videos/${itemToCreate._id}/edit`);

      assert.equal(jsdom(response.text).querySelector('[name="title"]').value, itemToCreate.title);
      assert.equal(jsdom(response.text).querySelector('[name="description"]').value, itemToCreate.description);
      assert.equal(jsdom(response.text).querySelector('[name="url"]').value, itemToCreate.url);
    });
  })
});
