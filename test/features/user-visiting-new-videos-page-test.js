const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visiting new videos page', () => {
  it('can save a video', () => {
    const itemToCreate = buildItemObject();
    browser.url('/videos/create');

    browser.setValue('#title-input', itemToCreate.title);
    browser.setValue('#description-input', itemToCreate.description);
    browser.setValue('#url-input', itemToCreate.url);
    browser.click('#submit-button');

    assert.include(browser.getText('body'), itemToCreate.title);
    assert.include(browser.getText('body'), itemToCreate.description);
    assert.equal(browser.getAttribute('iframe', 'src'), itemToCreate.url);
  });
});
