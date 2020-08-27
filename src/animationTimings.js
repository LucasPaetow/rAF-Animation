export function linear(timeFraction) {
	return timeFraction;
}

export function quad(timeFraction) {
	return Math.pow(timeFraction, 2);
}

export function circ(timeFraction) {
	return 1 - Math.sin(Math.acos(timeFraction));
}

export function easeOutCubic(timeFraction) {
	return 1 - Math.pow(1 - timeFraction, 3);
}

export function easeInOutQuart(timeFraction) {
	return timeFraction < 0.5
		? 8 * timeFraction * timeFraction * timeFraction * timeFraction
		: 1 - Math.pow(-2 * timeFraction + 2, 4) / 2;
}
