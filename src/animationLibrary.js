export default function animateWith({ duration, easing, animationStep }) {
	let startTime = performance.now();

	requestAnimationFrame(function animation(currentTime) {
		// timeFraction goes from 0 to 1
		let timeFraction = (currentTime - startTime) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// calculate the current animation state
		let progress = easing(timeFraction);

		animationStep(progress); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animation);
		}
	});
}
