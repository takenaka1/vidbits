const {assert} = require('chai');
const {buildItemObject, generateRandomUrl} = require('../test-utils');

const submitVideo = (video) => {
  browser.setValue('#title-input', video.title);
  browser.setValue('#description-input', video.description);
  browser.setValue('#url-input', video.url);
  browser.click('#submit-button');
};

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('can navigate to add a video', () => {
    it('view a page with the text', () => {
      browser.url('/videos/create');

      assert.include(browser.getText('body'), 'Save a video');
    });
  });

  describe('with an existing video', () => {
    it('renders the video in the list', () => {
      const itemToCreate = buildItemObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#url-input', itemToCreate.url);
      browser.click('#submit-button');

      browser.url('/');

      assert.include(browser.getText('#videos-container'), itemToCreate.title);
      assert.include(browser.getAttribute('iframe', 'src'), itemToCreate.url);
    });

    it('can navigate to a video', () => {
      const itemToCreate = buildItemObject();
      browser.url('/videos/create');
      submitVideo(itemToCreate);
      browser.url('/');
      browser.click('#videos-container a');

      assert.include(browser.getText('body'), itemToCreate.description);
    });
  });
});
