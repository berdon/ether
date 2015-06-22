var oop = require('./oop.js'),
	express = require('./express.js');

function die(error) {
	throw(error + '\r\n\r\n' + (new Error()).stack);
}

module.exports = {
	// TODO: Move to oop: oop
	property: oop.property,
	getter: oop.getter,
	override: oop.override,
	die: die,
	express: express
}