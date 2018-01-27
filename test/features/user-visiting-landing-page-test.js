const {assert} = require('chai');

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });
  describe('can navigate to add a video', () => {
    it('view a page with the text', () => {
      browser.url('/');
      browser.click('.add-button a');

      assert.include(browser.getText('body'), 'Save a video');
    });

  });
});
