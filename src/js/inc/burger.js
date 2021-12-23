/**
 * Burger js
 */
const   menuLinks   = document.querySelectorAll('.nav__link[data-goto]'),
        navBurger   = document.querySelector('.nav__burger'),
        navBody     = document.querySelector('.nav__body');

if (navBurger) {
    navBurger.addEventListener('click', function() {
        document.body.classList.toggle('no-scroll');
        navBurger.classList.toggle('nav__burger_active');
        navBody.classList.toggle('nav__body_active');
    });
}

/**
 * Smooth scrolling js
 * Attributes:
 * data-goto
 * Example:
 * Link     - a(class="link")
 * Block    - div(class="block")
 * a(class="link" data-goto=".block" href="#")
 */
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', onMenuLinkClick);
});

    function onMenuLinkClick (e) {
        const menuLink = e.target;

        if (menuLink.getAttribute('data-goto') && document.querySelector(menuLink.getAttribute('data-goto'))) {
            const   gotoBlock       = document.querySelector(menuLink.getAttribute('data-goto')),
                    gotoBlockValue  = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header.header').offsetHeight;

        if (navBurger.classList.contains('nav__burger_active')) {
            document.body.classList.remove('no-scroll');
            navBurger.classList.remove('nav__burger_active');
            navBody.classList.remove('nav__body_active');
        }

        window.scrollTo({
            top:        gotoBlockValue,
            behavior:   'smooth'
        });

        e.preventDefault();
        }
    }
}