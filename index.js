var oop = require('./oop.js');

function die(error) {
	throw(error + '\r\n\r\n' + (new Error()).stack);
}

module.exports = {
	property: oop.property,
	getter: oop.getter,
	override: oop.override,
	die: die
}