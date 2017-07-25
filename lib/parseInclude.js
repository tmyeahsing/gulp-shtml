var fs  = require('fs'),
    path = require('path'),
    colors = require('colors');

var encoding = 'utf8';
var ROOT = process.cwd() + '/';
var buffer = {};
var msgs = [];
var types = ['success', 'fail', 'warn'];

var mkdir = function(dest) {
    var destDirs = dest.split(/[\\/]/),
        destDirsLen = destDirs.length,
        destDir = '';

    if (!fs.existsSync(dest)) {
        destDirs.forEach(function(dir, i) {
            if (i < destDirsLen - 1) {
                destDir += dir + '/';
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir);
                    msgs.push({msg: '[mkdir] ' + destDir + ''});
                }
            }
        });
    }
};

var fixPath = function(src) {
    if (src && src.charAt(src.length - 1) !== '/') src += '/';
    return src;
};


var parseInclude = function(src, dest, wwwroot, save, parent) {
    var baseSrc = path.dirname(src) + '/',
        baseDest = path.dirname(dest) + '/',
        file, incs,
        result = 0;
    dest = dest.replace(/.shtml$/i, '.html');

    if (fs.existsSync(src)) {
        if (buffer[src]) {
            file = buffer[src];
        }
        else {
            file = fs.readFileSync(src, encoding);

            incs = file.match(/<!--\s*#include.+?"\s*-->/ig) || [];
            incs.forEach(function(inc, i) {
                var incFile = inc.match(/"(.+)"\s*-->/i)[1], replacement, incSrc, incDest;

                if (incFile.charAt(0) === '/') {
                    if (wwwroot === undefined) {
                        msgs.push({msg: 'require <--wwwroot> to find file ' + incFile, type: types[2]});
                        result = 1;
                        return;
                    }
                    else {
                        incSrc = path.resolve(wwwroot + incFile);
                        incDest = baseDest + incSrc.replace(process.cwd() + '\\', '');
                    }
                }
                else {
                    incSrc = baseSrc + incFile;
                    incDest = baseDest + incFile;
                }
                replacement = parseInclude(incSrc, incDest, wwwroot, false, src);

                if (replacement === undefined) {
                    result = 1;
                }
                else {
                    file = file.replace(inc, replacement);
                }
            });

            if (save) {
                if (result === 0) {
                    mkdir(dest);
                    fs.writeFileSync(dest, file, encoding);
                }
                msgs.push({msg: dest, type: types[result]});
            }
            else {
                buffer[dest] = file;
            }
        }
    }
    else {
        msgs.push({msg: 'file ' + src + ' not found', type: types[1]});
        console.log((types[1] + ': file ' + src + ' not found\n  @ '+ parent)[types[1]]);
    }

    return file;
};

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    success: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red',
    fail: 'red'
});


module.exports = parseInclude;

