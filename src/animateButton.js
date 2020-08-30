import animate from "./animationLibrary";
import { easeOutCubic, easeInOutQuart } from "./animationTimings";

const composeButton = document.querySelector(".js-activate-animation");
const animationContainer = document.querySelector(".js-expand-container");
const composeMenu = document.querySelector(".js-shrink-container");

let composeButtonDimensions;
let composeMenuDimensions;
let startingHeight;
let startingWidth;
let finishingHeight;
let finishingWidth;

function expandButtonContainer() {
	//get the dimensions of the starting element => the button
	composeButtonDimensions = composeButton.getBoundingClientRect();
	startingHeight = composeButtonDimensions.height;
	startingWidth = composeButtonDimensions.width;

	//enable the menu but hide it beforehand
	//this is nessesarry to get its dimension, otherwise they
	//cant be calculated
	animationContainer.classList.add("transitioning");
	composeMenu.style.display = "block";

	// get dimensions of the finishing element
	composeMenuDimensions = composeMenu.getBoundingClientRect();
	finishingHeight = composeMenuDimensions.height;
	finishingWidth = composeMenuDimensions.width;

	//remove the children from the render tree so they dont
	//need to be calculated(they will get a display: hidden)
	animationContainer.classList.add("hidden");

	animate({
		duration: 500,
		timing: easeOutCubic,
		draw(progress) {
			// shorthand to let the height/width not start at 0
			let correctedHeight =
				startingHeight + (finishingHeight - startingHeight) * progress;

			let correctedWidth =
				startingWidth + (finishingWidth - startingWidth) * progress;

			//graduelly hide the button
			composeButton.style.opacity = 1 - progress * 1.25;
			// but unhide the menu at the same time
			composeMenu.style.opacity = progress;

			/*both elements start from the same appearence (the button's) and transition to the end appearence (the menu's)*/

			//unround the button and the menu
			composeButton.style.borderRadius = `${50 * (1 - progress) + 5}%`;
			composeMenu.style.borderRadius = `${50 * (1 - progress) + 2}%`;

			//scale the button and menu up
			composeButton.style.minHeight = `${correctedHeight}px`;
			composeButton.style.minWidth = `${correctedWidth}px`;

			composeMenu.style.minHeight = `${correctedHeight}px`;
			composeMenu.style.minWidth = `${correctedWidth}px`;

			//hide button on last frame
			if (progress === 1) {
				composeButton.style.display = "none";
				animationContainer.classList.remove("hidden");
				//add the transitioning on the next render to make the opacity delay eyecandy work
				requestAnimationFrame(() => {
					animationContainer.classList.remove("transitioning");
				});
			}
		},
	});
}

function shrinkButtonContainer() {
	//enable the menu but hide it beforehand
	//this is nessesarry to get its dimension, otherwise they
	//cant be calculated
	animationContainer.classList.add("transitioning");
	composeButton.style.display = "block";

	//remove the children from the render tree so they dont
	//need to be calculated(they will get a display: hidden)
	animationContainer.classList.add("hidden");

	animate({
		duration: 500,
		timing: easeInOutQuart,
		draw(progress) {
			// shorthand to let the height/width not start at 0
			let correctedHeight =
				startingHeight + (finishingHeight - startingHeight) * (1 - progress);

			let correctedWidth =
				startingWidth + (finishingWidth - startingWidth) * (1 - progress);

			//graduelly hide the button
			composeMenu.style.opacity = 1 - progress * 1.25;
			// but unhide the menu at the same time
			composeButton.style.opacity = progress;

			/*both elements start from the same appearence (the button's) and transition to the end appearence (the menu's)*/

			//round the button and the menu
			composeButton.style.borderRadius = `${50 * progress}%`;
			composeMenu.style.borderRadius = `${50 * progress}%`;

			//scale the button and menu down
			composeButton.style.minHeight = `${correctedHeight}px`;
			composeButton.style.minWidth = `${correctedWidth}px`;

			composeMenu.style.minHeight = `${correctedHeight}px`;
			composeMenu.style.minWidth = `${correctedWidth}px`;

			//hide button on last frame
			if (progress === 1) {
				composeMenu.style.display = "";
				animationContainer.classList.remove("hidden");
				//add the transitioning on the next render to make the opacity delay eyecandy work
				requestAnimationFrame(() => {
					animationContainer.classList.remove("transitioning");
				});
			}
		},
	});
}

export default function initButtonTransition() {
	composeButton.addEventListener("click", expandButtonContainer);
	composeMenu.addEventListener("click", shrinkButtonContainer);
}
