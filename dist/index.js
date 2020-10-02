"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.get('/', function (req, res) {
  var site = 'website';
  res.send("Starting to scrape! ".concat(site));
});
app.listen(8000, function () {
  console.log('Starting up!');
});