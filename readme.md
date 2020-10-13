# Advance your animations cRAFt to the next level

## The Javascript way

When animations get more complex and page reflows (the browser's process of recalculating element dimensions [Read more about it in the first part of this series](https://dev.to/s2engineers/better-animations-with-this-one-flip-n-trick-205a)) can’t be avoided, we need help from JavaScript to achieve smooth motion.

With these JavaScript animations, we can't just declare a transition time and easing function (like with CSS transitions), we have to create them ourselves. This will get better eventually with the web animation API, [whichs support is still not great for older browsers](https://caniuse.com/#search=Web%20Animations%20API). Until then, we have to manually update the screen in many little steps to make it seem fluid. A good way to do it is with [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).

Before requestAnimationFrame was a widely available, `setTimeout` or `setInterval` were used for this 'updating-the-screen-in-many-little-steps'-mechanism. To make them run every frame of a 60 Hz display, they both were given a timing argument of `1000/60` milliseconds. But this was a hack and sometimes, depending on the complexity of the animation, the browser couldn't make it with the calculation to the next screen update / interval / step (roughly 10ms). The animation wouldn't progress in the current frame but twice in the next one. This effect can add up and the animation might appear to be buggy.

#### requestAnimationFrame to the rescue.

`requestAnimationFrame` helps to orchestrate the animations and will ensure to run a callback / an animation step before the next screen update. It tells the browser about the intention of animating something and the browser in return can prepare and optimize beforehand.
Keep in mind that this function is only animating one frame. To use this in a full-scale animation, it needs to run again and again until the animation is done. This can be done with the function calling itself after each small step (a function calling itself is also known as a recursive function):

This is a very basic animation function taken from [JavaScript.info](https://javascript.info/js-animation#structured-animation) (but with variables renamed for clarity):

```
function animateWith({duration, easing, animationStep}) {

  let startTime = performance.now();

  requestAnimationFrame(function animation(currentTime) {
    let timeFraction = (currentTime - startTime) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = easing(timeFraction)

    animationStep(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animation);
    }

  });
}
```

(This might look complicated at first but don’t be intimidated, we will go through this in a bit)

It will be used like this (e.g. for animating the width of an element):

```
let element = document.getElementByID("progress")

animateWith({
  duration: 1000,
  easing(timeFraction) {
    return timeFraction;
  },
  animationStep(progress) {
    element.style.width = progress * 100 + '%';
  }
});
```

Implementing this "animation engine" can be done differently but most implementations revolve around some key points:

- a way to keep track of the animation progress (time elapsed of a total time can be expressed as progress),
- the change in the DOM layout based on that progress
- re-running the function again until the duration is up, often by recalling itself

#### The Animation Function explained

1. The whole animation function begins by setting a starting time, which is kept alive in a closure (or stored in a variable)
2. The inner function (the actual animation function) is called within the next frame
3. In here the current progress of the animation, the `timeFraction`, gets determined by subtracting the starting time from the current time (note for the current time parameter: requestAnimationFrame automatically gets a timestamp as an argument when it is called, which is used here for the current time). The resulting difference (the absolute time progressed since the starting time) will be divided by the duration to give us a relative time value between 0 and 1 of how much the full duration is already passed.
4. This `timeFraction` is also used for the easing of the animation (the speeding up or slowing down of the motion to make it seem more natural). To archive this, the `timeFraction` will get transformed to fit an easing curve (or a curve on a XY-coordinate graph — suddenly math becomes useful again)

- not transforming the values at all (just returning them) is equal to a linear easing, the motion will be at the same pace for the whole duration. For example a linear progression for numbers from 0-1 could be `0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1`
- In something else, like an ease-in function, the numbers would be transformed to the power of 2 (seen below) and our example numbers from the linear progression would look differently: `0.01, 0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81, 1`. They start much slower at first but progress faster in the second half

```
function quad(timeFraction) {
// pow is the power of n
  return Math.pow(timeFraction, 2)
}
```

more easing functions can be found here [Easing Functions Cheat Sheet](https://easings.net/)

5. The transformed timing fraction (progress) is then given to the actual DOM-changing `animationStep` function. Since the progress is always between 0 and 1, it's great for the use of percentage-based value changes
6. The last step is to determine if the function should run again. This is also based on progress and the reason why it can’t or shouldn't succeed 1 as value, because 1 means 100% of the duration is passed.

#### Great, lets see it in action

---

CODE EXAMPLE

- [CodeSandbox](https://codesandbox.io/s/github/LucasPaetow/rAF-Animation/tree/master/) to see the code
- [live site](https://boring-bohr-d84e30.netlify.app/) to just see it in action

---

#### Some tips and tricks

- If you want to animate properties that you also need for the calculations, like `height` or `width`, you can use `minHeight/ maxHeight` or `minWidth/maxWidth` for the animation instead. This way you won't have difficulties recalculating the original values again.

- Animating values from 0 to your desired value is just `desiredValue * progress` and the opposite is `desiredValue * (1-progress)` but if you want to animate partial values to 1, the formula gets a little more complicated:

-- `partialValue + (desiredValue - partialValue) * progress` or for the opposite `partialValue + (desiredValue - partialValue) * (1 * progress)`

The only new thing here is `(desiredValue - partialValue)`, which means the amount without the starting value. For example, animating opacity from 0.25 to 1 this part would be the missing 0.75 and only these get animated.
