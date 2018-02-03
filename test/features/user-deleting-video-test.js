const {assert} = require('chai');
const {buildItemObject, generateRandomUrl} = require('../test-utils');

describe('User deleting video', () => {
  it('removes the video from the list', () => {
    const video = buildItemObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#description-input', video.description);
    browser.setValue('#url-input', video.url);
    browser.click('#submit-button');

    browser.click('#delete');

    assert.notInclude(browser.getText('body'), video.title);
    assert.notInclude(browser.getText('body'), video.description);
    assert.notInclude(browser.getText('body'), video.url);
  });
});
