let ua = window.navigator.userAgent;
let msie = ua.indexOf("MSIE ");

// Check if user is using mobile
let isMobile = {
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

export function isWebp() {
    // Test WebP Browser Support
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function() {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    // Check for WebP support
    testWebP(function (support) {
        let className = support === true? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}

// Remove classes function
export function removeClasses(containers, className) {
    for (let i = 0; i < containers.length; i++) {
        if (containers[i].classList.contains(className)) {
            containers[i].classList.remove(className);
        }
    }
}