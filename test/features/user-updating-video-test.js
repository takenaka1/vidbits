const {assert} = require('chai');
const {buildItemObject, generateRandomUrl} = require('../test-utils');

describe('User updating video', () => {
  it('changes the values', () => {
    const video = buildItemObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#description-input', video.description);
    browser.setValue('#url-input', video.url);
    browser.click('#submit-button');

    browser.click('#edit');
    const newVideo = buildItemObject({title: 'newtitle'});
    browser.setValue('#title-input', newVideo.title);
    browser.setValue('#description-input', newVideo.description);
    browser.setValue('#url-input', newVideo.url);
    browser.click('#submit-button');

    assert.include(browser.getText('body'), newVideo.title);
  });

  it('does not create an additional video', () => {
    const video = buildItemObject();
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#description-input', video.description);
    browser.setValue('#url-input', video.url);
    browser.click('#submit-button');

    browser.click('#edit');
    const newVideo = buildItemObject({title: 'newtitle'});
    browser.setValue('#title-input', newVideo.title);
    browser.setValue('#description-input', newVideo.description);
    browser.setValue('#url-input', newVideo.url);
    browser.click('#submit-button');

    browser.url('/');
    assert.notInclude(browser.getText('body'), video.title);

  });
});
