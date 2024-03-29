// vocabList is an array of JSON objects to
// better reflect the format of the persistent data
const vocabList = [];

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

const getVocabJSON = (request, response) => {
  getJSON(request, response, JSON.stringify(vocabList), 200);
};

// Helper function to search a given list for a given query
function searchList(query, list, type) {
  for (let i = 0; i < list.length; i++) {
    if (type === 'word') {
      if (list[i].word === query) {
        return JSON.stringify(list[i]);
      }
    }
    if (type === 'definition') {
      if (list[i].definition === query) {
        return JSON.stringify(list[i]);
      }
    }
  }
  return 0;
}

// a get request with search parameters
const getWithParams = (request, response, body) => {
  const jsonObj = {
    message: 'Missing Required Parameters',
  };

  /* searching for a word requires 2 params:
  the search query itself, and the type of search being performed
  (search by word or definition) */
  if (!body.query || !body.type) {
    jsonObj.id = 'missingParams';
    return getJSON(request, response, JSON.stringify(jsonObj), 400);
  }

  let wordObj = null;

  // search lists by the search type (only 5 lists, 5 searches)
  wordObj = searchList(body.query, JSON.parse(verbs), body.type);
  if (wordObj) {
    return getJSON(request, response, wordObj, 200);
  }

  wordObj = searchList(body.query, JSON.parse(nouns), body.type);
  if (wordObj) {
    return getJSON(request, response, wordObj, 200);
  }

  wordObj = searchList(body.query, JSON.parse(adjectives), body.type);
  if (wordObj) {
    return getJSON(request, response, wordObj, 200);
  }

  wordObj = searchList(body.query, JSON.parse(adverbs), body.type);
  if (wordObj) {
    return getJSON(request, response, wordObj, 200);
  }

  wordObj = searchList(body.query, vocabList, body.type);
  if (wordObj) {
    return getJSON(request, response, wordObj, 200);
  }

  // should only not return 200 if nothing was found
  // else return 404, not found
  if (!wordObj) {
    jsonObj.message = 'Term not found';
    jsonObj.id = 'notFound';
    return getJSON(request, response, JSON.stringify(jsonObj), 404);
  }

  // because Arrow functions need to return a value by default;
  return 0;
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
const postVocab = (request, response, body) => {
  const jsonObj = {
    message: 'Missing Required Parameters',
  };

  // a new vocab word should include 3 parts:
  // the italian word, the type of word, and its definition
  if (!body.word || !body.type || !body.definition) {
    jsonObj.id = 'missingParams';
    return getJSON(request, response, JSON.stringify(jsonObj), 400);
  }

  // status is "update" by default
  let status = 204;

  // create a new vocab word if it is not already in the list
  if (!vocabList[body.word]) {
    status = 201;
    vocabList[body.word] = {};
    vocabList.push(vocabList[body.word]);
  }

  // console.log(vocabList[body.word]);

  // Assign data
  vocabList[body.word].word = body.word;
  vocabList[body.word].type = body.type;
  vocabList[body.word].definition = body.definition;

  if (status === 201) {
    jsonObj.message = 'Created Successfully';
    return getJSON(request, response, JSON.stringify(jsonObj), status);
  }

  return returnJSONHead(request, response, status);
};

// Server Error (not GET, HEAD, or POST)
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
  getVocabJSON,
  getWithParams,
  JSONNotFound,
  returnListHead,
  headNotFound,
  postVocab,
  serverError,
};
