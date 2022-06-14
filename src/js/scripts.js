import * as functions from './inc/functions.js';

// LazyLoad
const lazyLoadInstance = new LazyLoad({
   elements_selector: ".lazy"
});

// Click listener
document.addEventListener('click', documentActions);

// Actions for click listener
function documentActions(e) {
   const targetElement = e.target;

   // Some action code...
}















lazyLoadInstance.update();