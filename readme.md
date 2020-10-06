# Performant Animations, Part 2: requestAnimationFrame

## The Javascript way

When animations get more complex and page reflows (the browser's process of recalculating element dimensions [Read more about it in the first part of this series](link-to-part-one)) can’t be avoided, we need help from JavaScript to achieve smooth motion.

Since we don’t have something like CSS transitions yet (while there is a web animation API, [it's support is still not great for older browsers](https://caniuse.com/#search=Web%20Animations%20API)), we need to create our own by manually updating the screen in many little steps, making it seem more fluid.

Previously, `setTimeout` or `setInterval` were used for this 'updating-the-screen-in-many-little-steps'-mechanismn. To make them run every frame of a 60hz display, they both were given a timing argument of `1000/60` milliseconds. But sometimes, depending on the complexity of the animation, the browser can’t make it with the calculation to the next screen update / interval / step (roughly 10ms). The animation wouldn't progress in the current frame but twice in the next one. This effect can add up and the animation might appear to be buggy.

#### requestAnimationFrame to the rescue.

`requestAnimationFrame` helps to orchestrate the animations and will ensure to run a callback / an animation step before the next screen update. It tells the browser about the intention of animating something and the browser in return can prepare and optimize beforehand.
Keep in mind that this function is only animating one frame. To use this in a full-scale animation, it needs to run recursively:

This is a very basic animation function taken from [JavaScript.info](https://javascript.info/js-animation):

```
function animate({timing, draw, duration}) {

  let startTime = performance.now();

  requestAnimationFrame(function animate(currentTime) {
    let timeFraction = (currentTime - startTime) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction)

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

(This might look complicated at first but don’t be intimidated, we will go through this in a bit)

It will be used like this (e.g. for animating width):

```
let element = document.getElementByID("progres")

animate({
  duration: 1000,
  timing(timeFraction) {
    return timeFraction;
  },
  draw(progress) {
    element.style.width = progress * 100 + '%';
  }
});
```

Implementing this "animation engine" can be done differently but most implementations revolve around some key points:

- a way to keep track of the animation progress (time elapsed of a total time can be expressed as progress),
- the change in the DOM layout based on the progress
- recalling or stopping itself

#### The Animation Function explained

1. The whole animation function begins by setting a starting time, which is kept alive in a closure (or stored in a variable)
2. The inner function is called within the next frame
3. In here the current time fraction gets determined by substracting the starting time from the current time

(note for the time parameter: requestAnimationFrame automatically gets a timestamp as an argument when it is called, which is used here for the current time).

The resulting difference will be divided by the duration to give us a value between 0 and 1 of how much of the full duration is already passed. 4. This "time fraction" is then transformed to fit an easing curve (or a curve on a xy - coordinate graph — suddenly math becomes useful again)

- not transforming the values at all (just returning them) is equal to a linear easing. For example a linear progression for numbers from 0-1 could be `0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1`
- In something else, like an ease-in function, the numbers would be transformed to the power of 2 (seen below) and our example numbers from the linear progression would look differently: `0.01, 0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81, 1`. They start much slower at first but progress faster in the second half

```
function quad(timeFraction) {
// pow is the power of n
  return Math.pow(timeFraction, 2)
}
```

more easing functions can be found here [Easing Functions Cheat Sheet](https://easings.net/)

5. The transformed timing fraction (progress) is then given to the drawing function. Since it is always between 0 and 1, it's great for percentage-based values
6. The last step is to determine if the function should run again. This is also based on process and the reason why it can’t or shouldn't succeed 1 as value, because 1 means 100% of the duration is passed.

#### Great, lets see it in action

---

CODE EXAMPLE

- [CodeSandbox](https://codesandbox.io/s/github/LucasPaetow/rAF-Animation/tree/master/) to see the code
- [live site](https://boring-bohr-d84e30.netlify.app/) to just see it in action

---

#### Some tips and tricks

- If you want to animate properties which you also need for the calculations, like `height` or `width`, you can use `minHeight/ maxHeight` or `minWidth/maxWidth` for the animation instead. This way you dont have difficulties recalculating the original values again.

- Animating values from 0 to your desired value is just `desiredValue * progress` and the opposite is `desiredValue * (1-progress)` but if you want to animate partial values to 1, the formula gets a little more complicated:

-- `partialValue + (desiredValue - partialValue) * progress` or for the opposite `partialValue + (desiredValue - partialValue) * (1 * progress)`

The only new thing here is `(desiredValue - partialValue)`, which means the amount without the starting value. For example, animating opacity from 0.25 to 1 this part would be the missing 0.75 and only these get animated.
