"use strict";

lib.css = {

	prefixes: ["ms", "O", "Webkit", "Moz"],

	prefix: function (property, style) {
		if (!style) {
			style = document.documentElement.style;
		}
		if (property in style) {
			return property;
		}
		property = property.charAt(0).toUpperCase() + property.slice(1);
		var prefixed, prefixes = this.prefixes, i = prefixes.length;
		while (i--) {
			prefixed = prefixes[i] + property;
			console.log(prefixed);
			if (prefixed in style) {
				return prefixed;
			}
		}
		return undefined;
	}

};

new function () {

	var css = lib.css, style = document.documentElement.style,
		transitionDelay = css.prefix("transitionDelay", style),
		transitionDuration = css.prefix("transitionDuration", style),
		animationDelay = css.prefix("animationDelay", style),
		animationDuration = css.prefix("animationDuration", style),
		animationIterationCount = css.prefix("animationIterationCount", style);

	style = null;

	function parseFloats(string) {
		return string.split(",").map(function (string) {
			return Number.parseFloat(string) || 0;
		});
	}

	function calcTransitionTime(delay, duration) {
		var length = Math.max(duration.length, delay.length),
			i = 0, time, maxTime = 0;
		while (i < length) {
			time = (delay[i] || 0) + (duration[i] || 0);
			if (time > maxTime) {
				maxTime = time;
			}
			i++;
		}
		return Math.ceil(maxTime * 1000);
	}

	function getTransitionTime(style) {
		return calcTransitionTime(
			parseFloats(style[transitionDelay]),
			parseFloats(style[transitionDuration])
		);
	}

	function calcFiniteAnimationTime(delay, duration, count) {
		var length = Math.max(duration.length, delay.length, count.length),
			i = 0, time, maxTime = 0;
		while (i < length) {
			time = (delay[i] || 0) + (duration[i] || 0) * (count[i] || 0);
			if (time > maxTime) {
				maxTime = time;
			}
			i++;
		}
		return Math.ceil(maxTime * 1000);
	}

	function getFiniteAnimationTime(style) {
		return calcFiniteAnimationTime(
			parseFloats(style[animationDelay]),
			parseFloats(style[animationDuration]),
			parseFloats(style[animationIterationCount])
		);
	}

	function returnZero() {
		return 0;
	}

	css.getTransitionTime = transitionDelay ? getTransitionTime : returnZero;
	css.getFiniteAnimationTime = animationDelay ? getFiniteAnimationTime : returnZero;

};
