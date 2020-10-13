import animateWith from "./animationLibrary";
import { easeOutCubic } from "./animationTimings";

const toggleButton = document.querySelectorAll(".js-toggle-inbox");

function expandContainer(containerElement) {
	// init transition and start hiding elements
	containerElement.classList.add("transitioning");

	// get the container which is going to get animated
	let expandTarget = [...containerElement.children].find((child) =>
		child.className.includes("js-shrink-inbox")
	);

	let targetHeight = expandTarget.style.height.split("px")[0];

	animateWith({
		duration: 500,
		easing: easeOutCubic,
		animationStep(progress) {
			expandTarget.style.maxHeight = `${progress * targetHeight}px`;

			if (progress === 1) {
				containerElement.classList.remove("hidden");
				requestAnimationFrame(() => {
					containerElement.classList.remove("transitioning");
				});
			}
		},
	});
}

function shrinkContainer(containerElement) {
	// init transition and start hiding elements
	containerElement.classList.add("transitioning");

	// get the container which is going to get animated
	let shrinkTarget = [...containerElement.children].find((child) =>
		child.className.includes("js-shrink-inbox")
	);
	// get dimensions of that container and fix its current height
	let { height: shrinkTargetHeight } = shrinkTarget.getBoundingClientRect();
	//this will avoid a page jump when removing the child elements from the dom
	shrinkTarget.style.height = `${shrinkTargetHeight}px`;

	//removing them will make the page reflow calulations easier for the browser
	containerElement.classList.add("hidden");

	animateWith({
		duration: 500,
		easing: easeOutCubic,
		animationStep(progress) {
			shrinkTarget.style.maxHeight = `${(1 - progress) * shrinkTargetHeight}px`;

			if (progress === 1) {
				containerElement.classList.remove("transitioning");
			}
		},
	});
}

function toggleInbox(event) {
	let container = event.target.closest(".app__mail");
	let openState = container.classList.contains("open");

	!openState ? expandContainer(container) : shrinkContainer(container);

	container.classList.toggle("open");
}

export default function initInboxTransition() {
	toggleButton.forEach((button) =>
		button.addEventListener("click", toggleInbox)
	);
}
