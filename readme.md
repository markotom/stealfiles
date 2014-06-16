# Stealfiles

Download files from Google

# Usage

    var StealFiles = require('../stealFiles');

    var steal = new StealFiles({
      extension: 'pdf',
      query: 'site%3Ahttp%3A%2F%2Fwww.fondodeculturaeconomica.com+pdf',
      output: '/Users/marcogodinez/Dropbox/Libros FCE',
      firstPage: 0,
      totalPages: 5
    });

Download all files after get links

    steal.getLinks(function () {
      steal.downloadFiles();
    });

Only get links

    steal.getLinks(function (links) {
      console.log(links);
    });

Download a single file from array

    steal.downloadFile(3);
