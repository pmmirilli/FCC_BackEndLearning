// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Logger
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Check if date is in valid format
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

// Callback isolated and currying used for passing on the function to the 'app.get' methods.
let timestamp = function (dateNow) {
  return function (req, res) {
    let date = new Date();
    if (!dateNow) { // Should the user want a specific date, read the input from the URL. Otherwise, the /api path is left blank and the current date is returned.
      let input = req.params.date;
      if (input.match(/\d{13}/)) input = parseInt(input); //Check if the date is provided in UNIX (miliseconds) format. 
      date = new Date(input);
      if (!isValidDate(date)) return res.json({"error": "Invalid Date"}); // Custom "error" message in case the date is not valid, e.g., 2015-02-31.
    }
    let unix = Date.parse(date);
    return res.json({"unix":unix, "utc":date.toUTCString()});
  }
}

app.get("/api", timestamp(true));
app.get("/api/:date?", timestamp(false));

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

