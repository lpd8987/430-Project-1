const http = require('http');
const url = require('url');
// const query = require('querystring');

const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGET = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/':
      break;
    case '/clientStyle.css':
      break;
    case '/verbs':
      jsonHandler.getVerbJSON(request, response);
      break;
    case '/nouns':
      jsonHandler.getNounJSON(request, response);
      break;
    case '/adjectives':
      jsonHandler.getAdjectiveJSON(request, response);
      break;
    case '/adverbs':
      jsonHandler.getAdverbJSON(request, response);
      break;
    default:
      jsonHandler.JSONNotFound(request, response);
      break;
  }
};

const handleHEAD = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/verbs':
    case '/nouns':
    case '/adjectives':
    case '/adverbs':
      jsonHandler.returnListHead(request, response);
      break;
    default:
      jsonHandler.headNotFound(request, response);
      break;
  }
};

// Route requests depending on therir
const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  switch (request.method) {
    case 'POST':
      break;
    case 'HEAD':
      handleHEAD(request, response, parsedURL);
      break;
    case 'GET':
      handleGET(request, response, parsedURL);
      break;
    default:
      // user attempts an operation other than POST, HEAD, or GET
      jsonHandler.serverError(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port 127.0.0.1:${port}`);
});
