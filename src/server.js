const http = require('http');
const url = require('url');
const query = require('querystring');

const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseParams = (request, response, handlerFunction) => {
  const parsedContent = [];

  request.on("error", () => {
    response.statusCode = 400;
    response.end();
  });

  request.on("data", (dataChunk) => {
    parsedContent.push(dataChunk);
  });

  request.on("end", () => {
    const parsedString = Buffer.concat(parsedContent).toString();
    const params = query.parse(parsedString);

    handlerFunction(request, response, params);
  });
}

// Route POST requests
const handlePOST = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case "/addVocab":
    default:
      parseParams(request, response, jsonHandler.postVocab)
      break;
  }
};

// Route GET requests
const handleGET = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/':
      htmlHandler.getClient(request, response);
      break;
    case '/clientStyle.css':
      htmlHandler.getStyle(request, response);
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
    case '/vocabulary':
      jsonHandler.getVocabJSON(request, response);
      break;
    default:
      jsonHandler.JSONNotFound(request, response);
      break;
  }
};

// Route HEAD requests
const handleHEAD = (request, response, parsedURL) => {
  switch (parsedURL.pathname) {
    case '/verbs':
    case '/nouns':
    case '/adjectives':
    case '/adverbs':
    case '/vocabulary':
      jsonHandler.returnListHead(request, response);
      break;
    default:
      jsonHandler.headNotFound(request, response);
      break;
  }
};

// Route requests depending on their request type.
const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  switch (request.method) {
    case 'POST':
      handlePOST(request, response, parsedURL);
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
