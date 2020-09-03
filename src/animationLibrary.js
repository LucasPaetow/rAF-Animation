export default function animate({ timing, draw, duration }) {
	let startTime = performance.now();

	requestAnimationFrame(function animate(currentTime) {
		// timeFraction goes from 0 to 1
		let timeFraction = (currentTime - startTime) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// calculate the current animation state
		let progress = timing(timeFraction);

		draw(progress); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}
