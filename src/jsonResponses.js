// const vocabList = {};

const fs = require('fs');

const verbs = fs.readFileSync(`${__dirname}/../data/verbs.json`);
const nouns = fs.readFileSync(`${__dirname}/../data/nouns.json`);
const adjectives = fs.readFileSync(`${__dirname}/../data/adjectives.json`);
const adverbs = fs.readFileSync(`${__dirname}/../data/adverbs.json`);

// GET
// Sends the GET response
const getJSON = (request, response, jsonObj, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(jsonObj);
  response.end();
};

// Returns the list of Verbs
const getVerbJSON = (request, response) => {
  getJSON(request, response, verbs, 200);
};

// Returns the list of Nouns
const getNounJSON = (request, response) => {
  getJSON(request, response, nouns, 200);
};

// Returns the list of Adjectives
const getAdjectiveJSON = (request, response) => {
  getJSON(request, response, adjectives, 200);
};

// Returns the list of Adverbs
const getAdverbJSON = (request, response) => {
  getJSON(request, response, adverbs, 200);
};

// Sends an error object (404 - not found) if the url is not found
const JSONNotFound = (request, response) => {
  const jsonObj = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  getJSON(request, response, JSON.stringify(jsonObj), 404);
};

// HEAD
// Sends the HEAD response
const returnJSONHead = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// sets the status code for the HEAD (200 - Success)
const returnListHead = (request, response) => {
  returnJSONHead(request, response, 200);
};

// sets the status code for the HEAD (404 - Not Found)
const headNotFound = (request, response) => {
  returnJSONHead(request, response, 404);
};

// POST

// Server Error
const serverError = (request, response) => {
  const jsonObj = {
    message: 'Something went wrong with the server.',
    id: 'serverError',
  };

  getJSON(request, response, JSON.stringify(jsonObj), 500);
};

module.exports = {
  getVerbJSON,
  getNounJSON,
  getAdjectiveJSON,
  getAdverbJSON,
  JSONNotFound,
  returnListHead,
  headNotFound,
  serverError,
};
