/**
 * Popup js
 * Example:
 * <a data-popup="link" href="#name">Link</a>
 * <div class="popup popup-name">
 *     <a class="popup__close popup-close">close</a>
 * </div>
 * Add class="lock-padding" for fixed sections
 */
const   popupLinks  = document.querySelectorAll('*[data-popup="link"]'),
        lockPadding = document.querySelectorAll('.lock-padding');

let unlock  = true,
    timeout = 500;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];

        popupLink.addEventListener('click', function(e) {
            const   popupName       = popupLink.getAttribute('href').replace('#', ''),
                    currentPopup    = document.querySelector('.popup-' + popupName);

            popupOpen(currentPopup);
            e.preventDefault();
        });
    }
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.popup_active');

        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }

        currentPopup.classList.add('popup_active');
        document.addEventListener('keydown', popupEscape);
        currentPopup.querySelector('.popup-close').addEventListener('click', popupCloseBtn);
        currentPopup.addEventListener('click', popupClose);
    }
}

function popupHide(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('popup_active');
        document.removeEventListener('keydown', popupEscape);
        popupActive.querySelector('.popup-close').removeEventListener('click', popupCloseBtn);
        popupActive.removeEventListener('click', popupClose);

        if (doUnlock) {
            bodyUnlock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.page').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }

    document.body.style.paddingRight = lockPaddingValue;
    document.body.classList.add('no-scroll');
    unlock = false;

    setTimeout(function() {
        unlock = true;
    }, timeout);
}

function bodyUnlock() {
    setTimeout(function() {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }

        document.body.style.paddingRight = '0px';
        document.body.classList.remove('no-scroll');
    }, timeout);
}

function popupEscape(e) {
    if (e.key === 'Escape') {
        const popupActive = document.querySelector('.popup.popup_active');
        popupHide(popupActive);
    }
}

function popupCloseBtn(e) {
    e.preventDefault();
    const popupActive = document.querySelector('.popup.popup_active');
    popupHide(popupActive);
}

function popupClose(e) {
    if (!e.target.closest('.popup__content')) {
        popupHide(e.target.closest('.popup'));
    }
}