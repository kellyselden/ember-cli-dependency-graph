define('ember-truth-helpers/utils/register-helper', ['exports', 'ember'], function (exports, _ember) {
	exports.registerHelper = registerHelper;

	function registerHelperIteration1(name, helperFunction) {
		//earlier versions of ember with htmlbars used this
		_ember['default'].HTMLBars.helpers[name] = _ember['default'].HTMLBars.makeBoundHelper(helperFunction);
	}

	function registerHelperIteration2(name, helperFunction) {
		//registerHelper has been made private as _registerHelper
		//this is kept here if anyone is using it
		_ember['default'].HTMLBars.registerHelper(name, _ember['default'].HTMLBars.makeBoundHelper(helperFunction));
	}

	function registerHelperIteration3(name, helperFunction) {
		//latest versin of ember uses this
		_ember['default'].HTMLBars._registerHelper(name, _ember['default'].HTMLBars.makeBoundHelper(helperFunction));
	}

	function registerHelper(name, helperFunction) {
		// Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
		// will be auto-discovered.
		if (_ember['default'].Helper) {
			return;
		}

		if (_ember['default'].HTMLBars._registerHelper) {
			if (_ember['default'].HTMLBars.helpers) {
				registerHelperIteration1(name, helperFunction);
			} else {
				registerHelperIteration3(name, helperFunction);
			}
		} else if (_ember['default'].HTMLBars.registerHelper) {
			registerHelperIteration2(name, helperFunction);
		}
	}
});