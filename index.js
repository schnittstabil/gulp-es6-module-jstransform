import {Transform} from 'node:stream';
import jstransform from 'es6-module-jstransform';
import PluginError from 'plugin-error';

const PLUGIN_NAME = 'gulp-es6-module-jstransform';

const errorToString = error => {
	let string = '';

	if (error.file && error.file.path) {
		string += `${error.file.path}:`;
	}

	string += `${error.lineNumber}:${error.column}: ${error.description}`;

	return string;
};

/**
 * https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
 */
export default function gulpEs6ModuleJsTransform() {
	const transformStream = new Transform({objectMode: true});

	/**
	* @param {Buffer|string} file
	* @param {string=} encoding - ignored if file contains a Buffer
	* @param {function(Error, object)} callback - Call this function (optionally with an
	*          error argument and data) when you are done processing the supplied chunk.
	*/
	transformStream._transform = function (file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
			return callback();
		}

		if (file.isBuffer()) {
			const src = file.contents.toString('utf8');
			try {
				const data = jstransform(src);
				file.contents = Buffer.from(data.code);
			} catch (error) {
				error.file = file;
				this.emit('error', new PluginError(PLUGIN_NAME, errorToString(error)));
			}

			this.push(file);
			return callback();
		}
	};

	return transformStream;
}
