A ssi plugin for [Gulp](https://github.com/gulpjs/gulp). Only include directive supported currently.Works with both include types

```html
<!--#include file="incs/inc.(s)html" -->
```

```html
<!--#include virtual="../incs/inc.(s)html" -->
```

# Install

```
npm install gulp-shtml --save-dev
```

# Basic Usage

Something like this will compile your Shtml files:

```javascript
'use strict';

var gulp = require('gulp');
var shtml = require('gulp-shtml');

gulp.task('shtml', function(){
   gulp.src('./wwwroot/*.shtml', {base: 'wwwroot'})
    .pipe(shtml({
      wwwroot: './wwwroot'
    }))
    .pipe(gulp.dest('build'));
});
```

## Options

###option.wwwroot
Require \"wwwroot\" as a base dir to find file incs.

# Issues

Fixed some buggy behaviour in other ssi plugins.

Both buffer and stream are supported.

Even though any type of file can be correctly parsed in theory, we strongly recommend to handle shtml/html only.

File extname won't be changed, use another plugin, [gulp-rename](https://www.npmjs.com/package/gulp-rename) for example instead.

To be continued...
