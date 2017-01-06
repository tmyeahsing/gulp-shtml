"use strict";
let path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    parseInclude = require('./lib/parseInclude'),
    PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-shtml';

module.exports = function (options) {
    if (!options.wwwroot) {
        throw new PluginError(PLUGIN_NAME, 'wwwroot should be assigned!');
    }
    let wwwroot = options.wwwroot;
    return through.obj(function (file, enc, cb) {
        let inputDirectory = file.path;
        let content = parseInclude(inputDirectory, '', wwwroot, false, inputDirectory);

        if (file.isBuffer()) {
            file.contents = new Buffer(content);
        }else if (file.isStream()) {
            file.contents = through().write(content);
        }

        this.push(file);
        cb();
    });
};