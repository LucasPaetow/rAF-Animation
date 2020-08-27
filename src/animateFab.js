import animate from "./animationLibrary";
import { easeOutCubic, easeInOutQuart } from "./animationTimings";

const fabButton = document.querySelector(".js-activate-animation");
const animationContainer = document.querySelector(".js-expand-container");
const composeMenu = document.querySelector(".js-shrink-container");

function expandFABContainer() {
	let fabButtonDimensions = fabButton.getBoundingClientRect();

	let { height: startingHeight, width: startingWidth } = fabButtonDimensions;

	//enable the menu but hide it beforehand
	animationContainer.classList.add("transitioning");
	composeMenu.style.display = "block";

	let composeMenuDimensions = composeMenu.getBoundingClientRect();

	let {
		height: finishingHeight,
		width: finishingWidth,
	} = composeMenuDimensions;

	console.log("starting: ", startingHeight, startingWidth);
	console.log("finishing: ", finishingHeight, finishingWidth);

	animate({
		duration: 500,
		timing: easeOutCubic,
		draw(progress) {
			let correctedHeight =
				finishingHeight * progress < startingHeight
					? startingHeight
					: finishingHeight * progress;

			let correctedWidth =
				finishingWidth * progress < startingWidth
					? startingWidth
					: finishingWidth * progress;

			//hide the button
			fabButton.style.opacity = 1 - progress;

			//unround the container
			animationContainer.style.borderRadius = `${50 * (1 - progress) + 5}%`;

			//scale the container
			animationContainer.style.height = `${correctedHeight}px`;
			animationContainer.style.width = `${correctedWidth}px`;

			//unhide the menu
			composeMenu.style.opacity = progress;

			//hide button on last frame
			if (progress === 1) {
				fabButton.style.display = "none";
			}
		},
	});
}

function shrinkFABContainer(event) {}

export default function initFABTransition() {
	fabButton.addEventListener("click", expandFABContainer);
	composeMenu.addEventListener("click", shrinkFABContainer);
}
