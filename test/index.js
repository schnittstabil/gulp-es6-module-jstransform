'use strict';

var assert = require('assert'),
    through = require('through2'),
    gutil = require('gulp-util'),
    transform = require('../index');

describe('gulp-es6-module-jstransform', function() {
  describe('in buffer mode', function() {
    it('should transpile', function(done) {
      var stream = transform();
      stream.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), 'var Foo = require(\'./foo\').Foo;');
      });

      stream.write(new gutil.File({
        cwd: '/',
        base: '/test/',
        path: '/test/file.js',
        contents: new Buffer('import {Foo} from \'./foo\';')
      }));

      stream.on('end', function() {
        done();
      });
      stream.end();
    });

    it('should handle syntax errors', function(done) {
      var stream = transform();
      stream.once('data', function (file) {
        assert(file.isBuffer());
      });

      stream.on('error', function(err) {
        assert(err instanceof Error);
      });

      stream.on('end', function() {
        done();
      });

      stream.write(new gutil.File({
        contents: new Buffer('vark x = 3;')
      }));
      stream.end();
    });

    it('should let null files pass through', function(done) {
      var stream = transform(),
          n = 0;

      stream.pipe(through.obj(
        function(file, enc, callback) {
          assert.equal(file.path, '/test/null.js');
          assert.equal(file.contents, null);
          n++;
          callback();
        },
        function() {
          assert.equal(n, 1);
          done();
        })
      );

      stream.write(new gutil.File({
        cwd: '/',
        base: '/test/',
        path: '/test/null.js',
        contents: null
      }));
      stream.end();
    });
  });
});
