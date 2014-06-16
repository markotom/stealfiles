'use strict';

var StealFiles = require('../stealFiles');

var steal = new StealFiles({
  extension: 'pdf',
  query: 'site%3Ahttp%3A%2F%2Fwww.fondodeculturaeconomica.com+pdf',
  output: '/Users/marcogodinez/Dropbox/Libros FCE',
  firstPage: 0,
  totalPages: 5
});

// Download files after get links
steal.getLinks(function () {
  steal.downloadFiles();
});
