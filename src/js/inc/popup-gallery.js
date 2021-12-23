/**
 * Popup Gallery js
 * Add class="gallery-init" for galleries
 * Add class="lock-padding" for fixed sections
 */
const   galleries                   = document.querySelectorAll('.gallery-init'),
        galleryClassName            = 'gallery',
        galleryLineClassName        = 'gallery__line',
        gallerySlideClassName       = 'gallery__slide',
        galleryNavClassName         = 'gallery__nav';
        galleryNavLeftClassName     = 'gallery__nav_left';
        galleryNavRightClassName    = 'gallery__nav_right';
        galleryNavDisabledClassName = 'gallery__nav_disabled';
        galleryDotsClassName        = 'gallery__dots';
        galleryDotClassName         = 'gallery__dot';
        galleryDotActiveClassName   = 'gallery__dot_active';
        galleryDraggableClassName   = 'gallery-draggable';

class Gallery {
    constructor(gallery, links) {
        this.containerNode          = gallery;
        this.popup                  = this.containerNode.closest('.popup-gallery');
        this.links                  = links;
        this.currentSlide           = 0;
        this.size                   = gallery.childElementCount;
        this.currentSlideWasChanged = false
        this.unlock                 = true,
        this.timeout                = 500,
        this.lockPadding            = document.querySelectorAll('.lock-padding')
        this.lockPaddingValue       = 0;

        this.manageHTML             = this.manageHTML.bind(this);
        this.setParameters          = this.setParameters.bind(this);
        this.setEvents              = this.setEvents.bind(this);
        this.openPopup              = this.openPopup.bind(this);
        this.resizeGallery          = this.resizeGallery.bind(this);
        this.startDrag              = this.startDrag.bind(this);
        this.stopDrag               = this.stopDrag.bind(this);
        this.dragging               = this.dragging.bind(this);
        this.setStylePosition       = this.setStylePosition.bind(this);
        this.clickDots              = this.clickDots.bind(this);
        this.moveToLeft             = this.moveToLeft.bind(this);
        this.moveToRight            = this.moveToRight.bind(this);
        this.changeCurrentSlide     = this.changeCurrentSlide.bind(this);
        this.changeActiveDotClass   = this.changeActiveDotClass.bind(this);
        this.changeDisabledNav      = this.changeDisabledNav.bind(this);
        this.closePopup             = this.closePopup.bind(this);
        this.clickClosePopup        = this.clickClosePopup.bind(this);
        this.escapePopup            = this.escapePopup.bind(this);
        this.hidePopup              = this.hidePopup.bind(this);
        this.bodyLock               = this.bodyLock.bind(this);
        this.bodyUnlock             = this.bodyUnlock.bind(this);

        this.manageHTML();
        this.setParameters();
        this.links.forEach(link => link.addEventListener('click', this.openPopup));
    }

    manageHTML() {
        this.containerNode.innerHTML = `
            <a href="#" class="popup-gallery__close"></a>
            <div class="${galleryLineClassName}">
                ${this.containerNode.innerHTML}
            </div>
            <div class="${galleryNavClassName}">
                <button class="${galleryNavLeftClassName}"></button>
                <button class="${galleryNavRightClassName}"></button>
            </div>
            <div class="${galleryDotsClassName}"></div>
        `;
        this.lineNode   = this.containerNode.querySelector(`.${galleryLineClassName}`);
        this.closeNode  = this.containerNode.querySelector(`.popup-gallery__close`);
        this.dotsNode   = this.containerNode.querySelector(`.${galleryDotsClassName}`);
        this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
            wrapElementByDiv({
                element:    childNode,
                className:  gallerySlideClassName
            })
        );
        this.dotsNode.innerHTML = Array.from(Array(this.size).keys()).map((key) => (
            `<button class="${galleryDotClassName}${key === this.currentSlide ? ' ' + galleryDotActiveClassName : ''}"></button>`
        )).join('');
        this.dotNodes   = this.dotsNode.querySelectorAll(`.${galleryDotClassName}`);
        this.navLeft    = this.containerNode.querySelector(`.${galleryNavLeftClassName}`);
        this.navRight   = this.containerNode.querySelector(`.${galleryNavRightClassName}`);
    }

    setParameters() {
        const coordsContainer   = this.containerNode.getBoundingClientRect();
        this.width              = coordsContainer.width + this.lockPaddingValue;
        this.maximumX           = -(this.size - 1) * this.width;
        this.x                  = -this.currentSlide * this.width;

        this.resetStyleTransition();
        this.lineNode.style.width = `${this.size * this.width}px`;
        this.setStylePosition();
        this.changeActiveDotClass();
        this.changeDisabledNav();
        Array.from(this.slideNodes).forEach((slideNode) => {
            slideNode.style.width       = `${this.width}px`;
        });
    }

    setEvents() {
        this.debouncedResizeGallery = debounce(this.resizeGallery);
        window.addEventListener('resize', this.debouncedResizeGallery);
        this.lineNode.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
        window.addEventListener('pointercancel', this.stopDrag);

        this.dotsNode.addEventListener('click', this.clickDots);
        this.navLeft.addEventListener('click', this.moveToLeft);
        this.navRight.addEventListener('click', this.moveToRight);
        this.popup.addEventListener('click', this.closePopup);
        this.closeNode.addEventListener('click', this.clickClosePopup);
        document.addEventListener('keydown', this.escapePopup);
    }

    destroyEvents() {
        window.removeEventListener('resize', this.debouncedResizeGallery);
        this.lineNode.removeEventListener('pointerdown', this.startDrag);
        window.removeEventListener('pointerup', this.stopDrag);
        window.removeEventListener('pointercancel', this.stopDrag);

        this.dotsNode.removeEventListener('click', this.clickDots);
        this.navLeft.removeEventListener('click', this.moveToLeft);
        this.navRight.removeEventListener('click', this.moveToRight);
        this.popup.removeEventListener('click', this.closePopup);
        this.popup.removeEventListener('click', this.clickClosePopup);
        document.removeEventListener('keydown', this.escapePopup);
    }

    clickDots(evt) {
        const dotNode = evt.target.closest('button');

        if (!dotNode) {
            return;
        }

        let dotNumber;
        for (let i = 0; i < this.dotNodes.length; i++) {
            if (this.dotNodes[i] === dotNode) {
                dotNumber = i;
                break;
            }
        }

        if (dotNumber === this.currentSlide) {
            return;
        }

        const countSwipes = Math.abs(this.currentSlide - dotNumber);
        this.currentSlide = dotNumber;
        this.changeCurrentSlide(countSwipes);
    }

    moveToLeft() {
        if (this.currentSlide <= 0) {
            return;
        }

        --this.currentSlide;
        this.changeCurrentSlide();
    }

    moveToRight() {
        if (this.currentSlide >= this.size - 1) {
            return;
        }

        ++this.currentSlide;
        this.changeCurrentSlide();
    }

    changeCurrentSlide(countSwipes) {
        this.x = -this.currentSlide * this.width;
        this.setStylePosition();
        this.setStyleTransition(countSwipes);
        this.changeActiveDotClass();
        this.changeDisabledNav();
    }

    changeDisabledNav() {
        if (this.currentSlide <= 0) {
            this.navLeft.classList.add(galleryNavDisabledClassName);
        } else {
            this.navLeft.classList.remove(galleryNavDisabledClassName);
        }

        if (this.currentSlide  >= this.size - 1) {
            this.navRight.classList.add(galleryNavDisabledClassName);
        } else {
            this.navRight.classList.remove(galleryNavDisabledClassName);
        }
    }

    changeActiveDotClass() {
        for (let i = 0; i < this.dotNodes.length; i++) {
            this.dotNodes[i].classList.remove(galleryDotActiveClassName);
        }
        this.dotNodes[this.currentSlide].classList.add(galleryDotActiveClassName);
    }

    openPopup(evt) {
        evt.preventDefault();
        this.currentSlide   = evt.target.closest('a').getAttribute('data-popup-link');

        this.setEvents();

        if (this.popup && this.unlock) {
            this.bodyLock();
            this.popup.classList.add('popup-gallery_active');
        }

        this.setParameters();
    }

    closePopup(e) {
        if (!e.target.closest('.popup-gallery__content')) {
            this.hidePopup();
        }
    }

    clickClosePopup(e) {
        e.preventDefault();
        this.hidePopup();
    }

    escapePopup(e) {
        if (e.key === 'Escape') {
            this.hidePopup();
        }
    }

    hidePopup() {
        this.popup.classList.remove('popup-gallery_active');
        this.destroyEvents();
        this.bodyUnlock();
    }

    bodyLock() {
        const _this = this;
        this.lockPaddingValue = window.innerWidth - document.querySelector('.page').offsetWidth;

        if (this.lockPadding.length > 0) {
            for (let index = 0; index < this.lockPadding.length; index++) {
                const el = this.lockPadding[index];
                el.style.paddingRight = this.lockPaddingValue + 'px';
            }
        }

        document.body.style.paddingRight = this.lockPaddingValue + 'px';
        document.body.classList.add('no-scroll');
        this.unlock = false;

        setTimeout(function() {
            _this.unlock = true;
        }, _this.timeout);
    }

    bodyUnlock() {
        const _this = this;

        setTimeout(function() {
            if (_this.lockPadding.length > 0) {
                for (let index = 0; index < _this.lockPadding.length; index++) {
                    const el = _this.lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }

            document.body.style.paddingRight = '0px';
            document.body.classList.remove('no-scroll');
        }, _this.timeout);
    }

    startDrag(evt) {
        this.currentSlideWasChanged = false;
        this.clickX                 = evt.pageX;
        this.startX                 = this.x;

        this.containerNode.classList.add(galleryDraggableClassName);
        this.resetStyleTransition();
        window.addEventListener('pointermove', this.dragging);
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);

        this.containerNode.classList.remove(galleryDraggableClassName);
        this.changeCurrentSlide();
    }

    dragging(evt) {
        this.dragX      = evt.pageX;
        const dragShift = this.dragX - this.clickX;
        const easing    = dragShift / 5;
        this.x          = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
        this.setStylePosition();

        // Change active slide
        if (dragShift > 20 && dragShift > 0 && !this.currentSlideWasChanged && this.currentSlide > 0) {
            this.currentSlideWasChanged = true;
            --this.currentSlide;
        }

        if (dragShift < -20 && dragShift < 0 && !this.currentSlideWasChanged && this.currentSlide < this.size - 1) {
            this.currentSlideWasChanged = true;
            ++this.currentSlide;
        }
    }

    setStylePosition() {
        this.lineNode.style.transform = `translate(${this.x}px, 0)`;
    }

    setStyleTransition(countSwipes = 1) {
        this.lineNode.style.transition = `all ${.5 * countSwipes}s ease 0s`;
    }

    resetStyleTransition() {
        this.lineNode.style.transition = `all 0s ease 0s`;
    }

    resizeGallery() {
        this.lockPaddingValue = 0;
        this.setParameters();
    }
}

function wrapElementByDiv({element, className}) {
    const wrapperNode = document.createElement('div');

    wrapperNode.classList.add(className);
    element.parentNode.insertBefore(wrapperNode, element);
    wrapperNode.appendChild(element);

    return wrapperNode;
}

function debounce(func, time = 100) {
    let timer;
    return function (event) {
        clearTimeout(timer);
        timer = setTimeout(func, time, event);
    }
}

if (galleries.length > 0) {
    for (let index = 0; index < galleries.length; index++) {
        const   gallery = galleries[index],
                links   = gallery.querySelectorAll('a'),
                popup   = document.createElement('div');

        if (links.length > 0) {
            for (let i = 0; i < links.length; i++) {
                const   link    = links[i],
                        imgContainer = document.createElement('div'),
                        img     = document.createElement('img'),
                        imgPath = link.querySelector('img').getAttribute('src');

                link.setAttribute('data-popup-link', i);
                img.setAttribute('src', imgPath);
                imgContainer.classList.add('gallery__img');
                imgContainer.appendChild(img);
                popup.appendChild(imgContainer);
            }
        }

        popup.classList.add('popup-gallery', 'popup-gallery-' + index);
        popup.innerHTML = `
            <div class="popup-gallery__body">
                <div class="popup-gallery__content ${galleryClassName}">
                    ${popup.innerHTML}
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        new Gallery(popup.querySelector(`.${galleryClassName}`), links);
    }
}