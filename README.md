# [gulp](http://gulpjs.com)-[es6-module-jstransform](https://github.com/andreypopp/es6-module-jstransform) [![Build Status](https://travis-ci.org/schnittstabil/gulp-es6-module-jstransform.svg?branch=master)](https://travis-ci.org/schnittstabil/gulp-es6-module-jstransform)

> Transpile ES6 modules to CommonJS with [es6-module-jstransform](https://github.com/andreypopp/es6-module-jstransform).

## Install

```bash
$ npm install --save-dev gulp-es6-module-jstransform
```

## Usage

```js
var gulp = require('gulp'),
    transform = require('gulp-es6-module-jstransform');

gulp.task('default', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(transform())
    .pipe(gulp.dest('build'));
});
```

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
