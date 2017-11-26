# SimpleSlides.js

A very very simple slideshow, with minimal functionality and easy to integrate.

## Installation

1. Download *simpleslides.min.js* and add it to your HTML.
2. Link the required files.
```
<script src="https://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js"></script>
<script src="lib/simpleslides.min.js"></script>
```
3. Optional: Download *simpleslides.min.css*, if you want to use the built-in CSS styles.

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
Using the default values  
```
$(document).ready(function() {
  var slideshow = new SimpleSlides();
});
```

Using your own CSS classes:
```
var slideshow = new SimpleSlides({
  parentNode: '.mySlideshowClass',
  childrenNode: '.mySlideshowClass-item',
  navigationNode: '.mySlideshowClass-nav',
  navigationNodeChildren: '.mySlideshowClass-nav-item'
});
```

3. Start the plugin.
```
slideshow.start();
```

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

### Public Methods

#### `start`
Starts the slideshow.
```
slideshow.start();
````

#### `stop`
Stops the slideshow.
```
slideshow.stop();
````

#### `pause`
Pauses the slideshow.
```
slideshow.pause();
````

#### `resume`
Resume the slideshow.
```
slideshow.resume();
````

#### `on`
Adds an event handler function for the slideshow.
```
// @eventType: String
// @callback: Function
slideshow.on(eventType, callback);
````

#### `off`
Removes an event handler function for the slideshow.
```
// @eventType: String
// @callback: Function
slideshow.off(eventType, callback);
````

### Events
The plugin offers support for the following events:
```
start
stop
pause
resume
loop
change
```

Events can be added or removed by using the `on` and `off` methods.
```
slideshow.on(eventType, callback);
slideshow.off(eventType, callback);
```
