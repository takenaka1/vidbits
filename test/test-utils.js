const {jsdom} = require('jsdom');

const Item = require('../models/video');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

// Create and return a sample Item object
const buildItemObject = (options = {}) => {
  const title = options.title || 'My favorite item';
  const url = generateRandomUrl('xyz.com');
  const description = options.description || 'Just the best item';
  return {title, url, description};
};

// Add a sample Item object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const item = await Item.create(buildItemObject(options));
  return item;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

module.exports = {
  buildItemObject,
  seedItemToDatabase,
  parseTextFromHTML,
  generateRandomUrl
};
