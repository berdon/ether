function property(name, defaultValue) {
	this['_' + name] = defaultValue;
	return function(value) {
		if(arguments.length == 0 || value == undefined) {
			return this['_' + name];
		}

		this['_' + name] = value;
		return value;
	}
}

function getter(name, defaultValue) {
	this['_' + name] = defaultValue;
	return function(value) {
		return this['_' + name];
	}
}

function override() {
	var args = Array.prototype.slice.call(arguments);
	var handlers = { };
	for(var i = 0; i < args.length; i++) {
		if (!!handlers[args[i].length]) {
			throw('Cannot override method with same number of arguments');
		}

		handlers[args[i].length] = args[i];
	}

	return function() {
		var args = Array.prototype.slice.call(arguments);
		return handlers[args.length].apply(this, args);
	}
}

function die(error) {
	throw(error + '\r\n\r\n' + (new Error()).stack);
}

module.exports = {
	property: property,
	getter: getter,
	override: override,
	die: die
}