import {promisify} from 'node:util';
import File from 'vinyl';
import test from 'ava';
import through from 'through2';

import transform from './index.js';

const streamTest = fn => async t => {
	await promisify(fn)(t, transform());
};

test('gulp-es6-module-jstransform in buffer mode should transpile', streamTest((t, stream, callback) => {
	stream.once('data', file => {
		t.truthy(file.isBuffer());
		t.is(file.contents.toString('utf8'), 'var Foo = require(\'./foo\').Foo;');
	});

	stream.write(new File({
		cwd: '/',
		base: '/test/',
		path: '/test/file.js',
		contents: Buffer.from('import {Foo} from \'./foo\';')
	}));

	stream.on('end', () => {
		callback();
	});
	stream.end();
}));

test('gulp-es6-module-jstransform in buffer mode should handle syntax errors', streamTest((t, stream, callback) => {
	stream.once('data', file => {
		t.truthy(file.isBuffer());
	});

	stream.on('error', error => {
		t.truthy(error instanceof Error);
		t.is(error.message, '1:6: Unexpected identifier');
	});

	stream.on('end', () => {
		callback();
	});

	stream.write(new File({
		contents: Buffer.from('vark x = 3;')
	}));

	stream.end();
}));

test('gulp-es6-module-jstransform in buffer mode should let null files pass through', streamTest((t, stream, callback) => {
	let n = 0;

	stream.pipe(through.obj((file, encoding, done) => {
		t.is(file.path, '/test/null.js');
		t.is(file.contents, null);
		n++;
		done();
	}, () => {
		t.is(n, 1);
		callback();
	}));

	stream.write(new File({
		cwd: '/',
		base: '/test/',
		path: '/test/null.js',
		contents: null
	}));

	stream.end();
}));
