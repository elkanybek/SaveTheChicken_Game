// https://youtu.be/zIl5Q-dThi8?list=PL7wAPgl1JVvVJabcmRyEwg8k9rFxCRU9x

export default class Easing {
	// simple linear tweening - no easing
	// t: current time, b: beginning value, c: change in value, d: duration
	static linear(t, b, c, d) {
		return (c * t) / d + b;
	}

	// quadratic easing in - accelerating from zero velocity
	// t: current time, b: beginning value, c: change in value, d: duration
	// t and d can be in frames or seconds/milliseconds
	static easeInQuad(t, b, c, d) {
		return c * (t /= d) * t + b;
	}

	// quadratic easing out - decelerating to zero velocity
	static easeOutQuad(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	}

	// quadratic easing in/out - acceleration until halfway, then deceleration
	static easeInOutQuad(t, b, c, d) {
		if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
		return (-c / 2) * (--t * (t - 2) - 1) + b;
	}

	static easeInOutBack(t, b, c, d, s = 1.70158) {
		if ((t /= d / 2) < 1)
			return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	}
}
