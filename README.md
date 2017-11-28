# SimpleSlides.js

A very very simple slideshow, with minimal functionality and easy to integrate.

## Installation

1. Download [*simpleslides.min.js*](lib/simpleslides.min.js) and add it to your HTML.
2. Link the required files.
```
<script src="https://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js"></script>
<script src="lib/simpleslides.min.js"></script>
```
3. Optional: Download [*simpleslides.min.css*](lib/simpleslides.min.css), if you want to use the built-in CSS styles.

```
<link rel="stylesheet" href="lib/stylesheet.min.css">
```

## Usage

1. Wrap your slides with a container element.  
You can define your own CSS classes, or use the default ones as in this example:
```
<div class="simpleslides">
   <div class="simpleslides-item">Slide 1</div>
   <div class="simpleslides-item">Slide 2</div>
   <div class="simpleslides-item">Slide 3</div>
</div>
```

2. Initialize the plugin.  
Using the default DOM values.  
```
$(document).ready(function() {
  var simpleSlidesObj = new SimpleSlides();
});
```

Using your own DOM values:
```
var simpleSlidesObj = new SimpleSlides({
  parentNode: '.mySlideshowClass',
  childrenNode: '.mySlideshowClass-item',
  navigationNode: '.mySlideshowClass-nav',
  navigationNodeChildren: '.mySlideshowClass-nav-item'
});
```

3. Start the plugin.
```
simpleSlidesObj.start();
```

## Examples
Click [here](examples/) for the available examples.

## API

### Options

#### `parentNode`
Type: `String`  
Default: `.simpleslides`  
DOM node for the slidshow element.

#### `childrenNode`
Type: `String`  
Default: `.simpleslides-item`  
DOM node for the slidshow's children elements.

#### `navigationNode`
Type: `String`  
Default: `.simpleslides-nav`  
DOM node for the slidshow's navigation element.

#### `navigationNodeChildren`
Type: `String`  
Default: `.simpleslides-nav-item`  
DOM node for the navigation's children elements.

#### `slides`
Type: `Number`  
Default: `0`  
Number of slides of the slideshow.

#### `slide`
Type: `Number`  
Default: `1`  
Start slide of the slideshow.

#### `autoplay`
Type: `Boolean`  
Default: `false`  
Autoplay the slideshow.

#### `timeout`
Type: `Number`  
Default: `2000`  
Time a slide is shown, expressed in miliseconds.

#### `transitionTime`
Type: `Number`  
Default: `500`  
Time it takes to transition between slides, expressed in miliseconds.

#### `transitionEasing`
Type: `String`  
Default: `linear`  
Easing value for the slides.

#### `pauseOnHover`
Type: `Boolean`  
Default: `false`  
Wether or not the slideshow pauses when the mouse is over the slides.

#### `showNavigation`
Type: `Boolean`  
Default: `false`  
Wether or not the slideshow shows a navigation element.

#### `activeClass`
Type: `String`  
Default: `active`  
CSS class to append to the active slide.

#### `onStart`
Type: `Function`  
Default: `function`  
Callback function for the start event.

#### `onStop`
Type: `Function`  
Default: `function`  
Callback function for the stop event.

#### `onPause`
Type: `Function`  
Default: `function`  
Callback function for the pause event.

#### `onResume`
Type: `Function`  
Default: `function`  
Callback function for the resume event.

#### `onChange`
Type: `Function`  
Default: `function`  
Callback function for the slide change event.

#### `onDestroy`
Type: `Function`  
Default: `function`  
Callback function for the destroy event.  


### Public Methods

#### `start`
Starts the slideshow.
```
simpleSlidesObj.start();
````

#### `stop`
Stops the slideshow.
```
simpleSlidesObj.stop();
````

#### `pause`
Pauses the slideshow.
```
simpleSlidesObjpause();
````

#### `resume`
Resume the slideshow.
```
simpleSlidesObj.resume();
````

#### `destroy`
Destroys the slideshow.
```
simpleSlidesObj.destroy();
````

#### `goToSlide`
Goes to a specified slide.
```
// @slideNumber: Number
simpleSlidesObj.goToSlide(@slideNumber);
````

#### `goToPreviousSlide`
Goes to the previous slide.
```
simpleSlidesObj.goToPreviousSlide();
````

#### `goToNextSlide`
Goes to the next slide.
```
simpleSlidesObj.goToNextSlide();
````

#### `getCurrentSlide`
Returns the current slide number.
```
simpleSlidesObj.getCurrentSlide();
````

#### `getPreviousSlide`
Returns the previous slide number.
```
simpleSlidesObj.getPreviousSlide();
````

#### `getNextSlide`
Returns the next slide number.
```
simpleSlidesObj.getNextSlide();
````

### Events
The plugin offers support for the following events:
```
start
stop
pause
resume
change
destroy
```

Events can be instanced as part of the `options`.
```
var simpleSlidesObj = new SimpleSlides({
  ...
  eventType: callback
});
```
