module.exports = {
	property: function (name, defaultValue) {
		this['_' + name] = defaultValue;
		return function(value) {
			if(arguments.length == 0 || value == undefined) {
				return this['_' + name];
			}

			this['_' + name] = value;
			return value;
		}
	},

	getter: function (name, defaultValue) {
		this['_' + name] = defaultValue;
		return function(value) {
			return this['_' + name];
		}
	},

	override: function () {
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
}