# [gulp](http://gulpjs.com)-[es6-module-jstransform](https://github.com/andreypopp/es6-module-jstransform) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

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

MIT © [Michael Mayer](http://schnittstabil.de)
