const http = require("http");
const url = require("url");
const query = require("querystring");

const jsonHandler = require("./jsonResponses.js");
const { parse } = require("path");

const port = process.env.PORT || process.env.NODE_PORT || 3000;


const handleGET = (request, response, parsedURL) => {
    if(parsedURL.pathname === "/verbs"){
        jsonHandler.getExternalJSONData(request, response);
    }
}

const onRequest = (request, response) => {
    const parsedURL = url.parse(request.url);

    switch(request.method) {
     case "POST":
        break;
     case "HEAD":
        break;
     case "GET":
     default:
        handleGET(request, response, parsedURL);
        break;
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port 127.0.0.1:${port}`);
});