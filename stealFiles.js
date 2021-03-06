'use strict';

var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

var StealFiles = function (config) {

  this.config = config = config || {};

  config.firstPage = config.firstPage || 0;
  config.currentPage = config.currentPage || 0;
  config.totalPages = config.totalPages || 10;
  config.extension = config.extension || 'pdf'

  this.pdflinks = [];

};

StealFiles.prototype.getLinks = function (callback) {

  var self = this;

  request('http://www.google.com.mx/search?q=' + this.config.query + '&start=' + this.config.currentPage + '&ie=UTF-8#filter=0',
    function (error, response, body) {
      if (!error && response.statusCode === 200) {

        // Fake dom
        var $ = cheerio.load(body);

        // Search links
        var links = $('li.g .r > a').toArray();

        // For each link
        links.forEach(function (link, n) {
          // Match the gold
          var gold = $(link).attr('href').match('((http|https|ftp)?:\/\/\.+.' + self.config.extension + ')');

          if(gold && gold[1]) {
            // Set filename
            var filename = gold[1].match(/[^/]+$/g);

            // Only pdf files
            if(filename && filename[0]) {
              self.pdflinks.push(decodeURIComponent(gold[1]));
            }
          }

          if(n === links.length - 1) {
            if (self.config.currentPage < (self.config.totalPages * 10)) {
              self.getLinks(callback);
            } else {
              callback(self.pdflinks);
            }
          }

        });

      }
    }
  );

  this.config.currentPage = this.config.currentPage + 10;

};

StealFiles.prototype.downloadFiles = function (index) {

  index = index || 0;

  var self = this;
  var link = this.pdflinks[index];

  if (!link) {
    return;
  }

  var filename = link.match(/[^/]+$/g);
  if (filename && filename[0]) {
    var fileStream = fs.createWriteStream(this.config.output + '/' + filename[0]);
    request(link).pipe(fileStream);

    fileStream.on('finish', function () {
      self.downloadFiles(index + 1);
    });

  }

};

module.exports = StealFiles;
