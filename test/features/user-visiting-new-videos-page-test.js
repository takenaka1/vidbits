const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visiting new videos page', () => {
  it('can save a video', () => {
    const itemToCreate = buildItemObject();
    browser.url('/');
    browser.click('.add-button a');

    browser.setValue('#title-input', itemToCreate.title);
    browser.setValue('#description-input', itemToCreate.description);
    browser.click('#submit-button');
    //console.log(browser.getText('body'));
    assert.include(browser.getText('body'), itemToCreate.title);
    assert.include(browser.getText('body'), itemToCreate.description);
  });
});
