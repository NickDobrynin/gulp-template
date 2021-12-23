import * as functions from './inc/functions.js';

// Check for WebP support
functions.isWebp();

// Click listener
document.addEventListener('click', documentActions);

// Actions for click listener
function documentActions(e) {
   const targetElement = e.target;

   // Some action code...
}