"use strict";

var debug = require('debug')('ether/express');
var debug = require('debug')('ether/express');

module.exports = {
	demandPost: demandPost,
	demandGet: demandGet,
	handleError: handleError,
	Handler: Handler
}

function demandPost(req, res, param) {
	var hasParam = objectContains(req.body, param);

	if (!hasParam.result) {
		debug('Failed to locate ' + param + ' in request body.');
		debug(req);

		handleError(res)('Missing ' + hasParam.missingKeys.join(', ') + ' parameter' + (hasParam.missingKeys.length > 1 ? 's' : '') + '.');
	}

	return hasParam.result;
}

function demandGet(req, res, param) {
	var hasParam = objectContains(request.query, param);

	if (!hasParam.result) {
		debug('Failed to locate ' + param + ' in request body.');
		debug(req);

		handleError(res)('Missing ' + hasParam.missingKeys.join(', ') + ' parameter' + (hasParam.missingKeys.length > 1 ? 's' : '') + '.');
	}

	return hasParam.result;
}

function handleError(res) {
	return function(error) {
		throw(error);
		res.status(500).send({ 'error': '' + error });
	}
}

function Handler(models, config) {
	return function(app, sq) {
		var modelName = config.model.capitalizeFirstLetter();
		var model = models[modelName];

		app.get("/" + config.model, function(req, res) {
			model.findAll().then(
				function(items) {
					res.send(items);
				}, handleError(res));
		});

		app.get("/" + config.model + "/:id", function(req, res) {
			model.findOne({
				where: {
					'id': req.params.id
				}
			}).then(function(item) {
				if (!item) {
					return res.send(null);
				}

				res.send(item);
			}, handleError(res));
		});

		app.post("/" + config.model, function(req, res) {
			if(!demandPost(req, res, config.insertKeys)) return;

			var modelObject = {};
			for (var i = 0; i < config.insertKeys.length; i++) {
				var key = config.insertKeys[i];
				modelObject[key] = req.body[key];
			}

			// Insert a item
			model.create(modelObject).then(function(item) {
				res.send(item);
			}, handleError(res));
		});

		app.put("/" + config.model + "/:id", function(req, res) {
			if(!demandPost(req, res, config.updateKeys)) return;

			var updates = {};
			for (var i = 0; i < config.updateKeys.length; i++) {
				var key = config.updateKeys[i];
				updates[key] = req.body[key];
			}

			var modelObject = model.update(updates,
			{
				where: {
					'id': req.params.id
				}
			}).then(function(affected) {
				res.send(affected[0] > 0);
			}, handleError(res));
		});
	}
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function objectContains(object, param) {
	var missingKeys = [];
	var hasParam = true;
	if (typeof(param) === "array") {
		for(var i = 0; i < param.length; i++) {
			if (!(param[i] in object)) {
				missingKeys.push(param[i]);
				hasParam = false;
			}
		}
	} else {
		hasParam = param in object;
		if (!hasParam) {
			missingKeys.push(param);
		}
	}

	return {
		result: hasParam,
		missingKeys: missingKeys
	};
}