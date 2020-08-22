# Performant Animations, Part 2: requestAnimationFrame

The Javascript way

When the animations get more complex and page reflows can’t be avoided, we need help from javascript to achieve fluid animations.

But since we don’t have something like CSS transitions yet (there is a web animation API but its support is still not great for older browsers [Can I use… Support tables for HTML5, CSS3, etc](https://caniuse.com/#search=Web%20Animations%20API)), we need to create our own by manually update the screen in many little steps, to make it seems like a fluid animation.

Historically, `setTimeout` or `setIntervall` were used for the this stepping with a time of `1000/60`Milliseconds to run once a frame (of a 60hz display). But sometimes, depending on the complexity of the animation, the browser can’t make it with the calculation to the next repaint. The Animation won’t progress in the current- but twice in the next frame. This Effect starts to get noticeable and the animation starts to appear buggy.

#### requestAnimationFrame to the rescue.

`requestAnimationFrame` helps to orchestrate the animations and will guarantee to run an animation step before the next repaint. It tells the browser about the intention of animating something and the browser in return can prepare and optimize beforehand.
Keep in mind that this function is only animating one frame. To use this in an animation, it needs to run recursively:

This is a very basic animation function taken from [JavaScript animations](https://javascript.info/js-animation)

```
function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(currentTime) {
    let timeFraction = (currentTime - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction)

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

(This might look complicated but don’t be intimidated, we will go through this in a bit)

And is used like this (e.g. for animating width)

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

This can be done in different ways but they all evolve around

- a way to keep track of the animation progress (time elapsed / time remaining),
- the change in the DOM layout based on the progress
- recalling or stopping itself

#### The Animation Function explained

1. The whole animation function starts with a starting time, which is kept alive in a closure
2. The inner function is called within the next frame
3. The current time fraction is determined (note for the time parameter: requestAnimationFrame gets automatically a timestamp as argument when it is called, which is used here). Both `time` and `start` are milliseconds since time origin.
   This calculation will result in a number between 0 and 1
4. The time fraction is then transformed to fit an easing curve (or a curve on an xy - coordinate graph — suddenly math became useful again)
   - no transform at all (just returning the value) is equal to a linear easing
   - Ease-in would look like this

```
function quad(timeFraction) {
// pow is the power of n
  return Math.pow(timeFraction, 2)
}
```

    * more easing functions can be found here [Easing Functions Cheat Sheet](https://easings.net/)

5. The transforms timing fraction (progress) is then giving to the drawing function. Since it is always between 0 and 1, its great for percent-based values
6. The last step is to determine if the function should run again. This is also based on the timing fragment and the reason why it can’t succeed 1 as value.

#### Great, lets see it in action

---

## CODEEXAMPLE
