/**
 * Slider js
 * Example:
 * <div class="slider slider-swiper">
 *     <div>
 *         <div>Slide</div>
 *         <div>Slide</div>
 *         <div>Slide</div>
 *     </div>
 *     <div class="slider__dots"></div>
 *     <div class="slider__arrow_next"></div>
 *     <div class="slider__arrow_prev"></div>
 * </div>
 */
let sliders = document.querySelectorAll('.slider-swiper');

if (sliders.length > 0) {
    for (let index = 0; index < sliders.length; index++) {
        let slider          = sliders[index],
            sliderWrapper   = slider.children[0];

        if (sliderWrapper) {
            let sliderItems = sliderWrapper.children;
            sliderWrapper.classList.add('swiper-wrapper');
            if (sliderItems) {
                for (let index = 0; index < sliderItems.length; index++) {
                    let slide = sliderItems[index];
                    slide.classList.add('swiper-slide');
                }
            }
        }
    }
}

let mainSlider = document.querySelector('.slider');

if (mainSlider) {
    new Swiper(mainSlider, {
        observer:               true,
        observeParents:         true,
        observeSlideChildren:   true,
        watchOverflow:          true,
        parallax:               true,
        loop:                   true,
        loopAdditionalSlides:   5,
        slidesPerView:          1,
        spaceBetween:           32,
        speed:                  800,
        effect:                 'slide',     // 'slide','fade','flip','cube','coverflow'
        // Dots
        pagination: {
            el:         '.slider__dots',
            clickable:  true
        },
        // Arrows
        navigation: {
            nextEl: '.slider .slider__arrow_next',
            prevEl: '.slider .slider__arrow_prev'
        },
        breakpoints: {
            // 320: {
            // },
            // 480: {
            // },
            // 992: {
            // }
        }
    });
}