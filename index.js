//#!/usr/bin/env node
(function () {

    'use strict';

    var fs = require('fs');

    function cont (base, options) {

        var pt = require('path');

        // first cli parameter or current directory
        var folders = [ base ],
            files = [];

        // process folders
        function read(folder) {
            var hash = {};
            if (fs.existsSync(folder)) {

                var content = fs.readdirSync(folder);

                content.forEach(function(file) {

                    // ignore dot files/folders
                    if (file.indexOf('.') === 0) return;

                    var path = pt.join(folder, file),
                        stats = fs.statSync(path),
                        target = stats.isDirectory() ? folders : files;

                    // add
                    target.push({
                        name: file,
                        path: path,
                        level: undefined
                    });
                });
            }
        }

        // traverse subfolders
        var i = 0;
        while (folders[i]) {
            var folder = folders[i];
            read(folder);
            i++;
        }

        function extension(file) {
            var list = file.split('.');
            return list[list.length - 1];
        }

        return {
            folders: folders,
            files: files
        };
    }

    module.exports = function (folder, options) {
        options = options || {
            level: undefined,
            callback: undefined,
            files: [],
            folders: [],
            ignoreDotfiles: false
        };

        // error
        if (!folder) {
            console.error('Folder is not defined');
            return;
        }
        if (!fs.existsSync(folder)) {
            console.error('Folder ' + base + ' does not exists');
            return;
        }
        return cont(folder, options);
    };
})();


