let ua = window.navigator.userAgent;

// Check if user is using mobile
export let isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/Blackberry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}

// Check if user is using IE
export function isIE() {
    ua = navigator.userAgent;
    let is_ie = ua.indexOf("MSIE ") > 1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}
if (isIE()) {
    document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
    document.querySelector('html').classList.add('touch');
}

(function() {
    const isWebP = function() {
      const elem = document.createElement('canvas');

      if (!!(elem.getContext && elem.getContext('2d'))) {
          // was able or not to get WebP representation
          return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
      }

      // very old browser like IE 8, canvas not supported
      return false;
    };

    const webpSupported = isWebP();

    if (webpSupported === false) {
        const lazyItems = document.querySelectorAll('[data-src-replace-webp]');

        for (let i = 0; i < lazyItems.length; i++) {
            let item = lazyItems[i],
                dataSrcReplaceWebp = item.getAttribute('data-src-replace-webp');

            if (dataSrcReplaceWebp !== null) {
                item.setAttribute('data-src', dataSrcReplaceWebp);
            }
        }
    }
})();

// Remove classes function
export function removeClasses(containers, className) {
    for (let i = 0; i < containers.length; i++) {
        if (containers[i].classList.contains(className)) {
            containers[i].classList.remove(className);
        }
    }
}

// SlideToggle
export let slideUp = (target, duration = 500) => {
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height             = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow           = "hidden";
    target.style.height             = 0;
    target.style.paddingTop         = 0;
    target.style.paddingBottom      = 0;
    target.style.marginTop          = 0;
    target.style.marginBottom       = 0;
    window.setTimeout(() => {
        target.style.display = "none";
        target.style.removeProperty("height");
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("slide-toggle");
    }, duration);
}

export let slideDown = (target, duration = 500) => {
    target.style.removeProperty("display");
    let display = window.getComputedStyle(target).display;
    if (display === "none") display = "block";
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow       = "hidden";
    target.style.height         = 0;
    target.style.paddingTop     = 0;
    target.style.paddingBottom  = 0;
    target.style.marginTop      = 0;
    target.style.marginBottom   = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height             = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("slide-toggle");
    }, duration);
}

export let slideToggle = (target, duration = 500) => {
    if (!target.classList.contains("slide-toggle")) {
        target.classList.add("slide-toggle");
        if (window.getComputedStyle(target).display === "none") {
            return slideDown(target, duration);
        } else {
            return slideUp(target, duration);
        }
    }
}