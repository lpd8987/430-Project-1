const fs = require("fs");

const verbs = fs.readFileSync(`${__dirname}/../data/verbs.json`);

const getExternalJSONData = (request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(verbs);
    response.end();
};

module.exports = { 
    getExternalJSONData,
};