/**
 * Form js
 * Attributes:
 * data-required         -   required field
 * data-error            -   error message
 * data-input="pattern"  -   validate patterns('email', 'phone')
 */
const   forms       = document.querySelectorAll('form.form');
        formImage   = document.getElementById('formImage');

if (forms.length > 0) {
    // Create popup for form response
    let     formResponse = document.createElement('div');
            formResponse.classList.add('popup', 'popup-response');
            formResponse.innerHTML = '<div class="popup__body"><div class="popup__content"><a href="#" class="popup__close popup-close"></a><div class="popup__text"></div></div></div></div>';
            document.body.appendChild(formResponse);

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');

        // form.addEventListener('submit', formSend);
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            formResponse.querySelector('.popup__text').innerHTML = 'Test';
            popupOpen(formResponse);
        });

        // Validate inputs
        inputs.forEach(input => {
            let errorMessage = document.createElement('span');
            errorMessage.classList.add('form__error-message');
            input.insertAdjacentElement('beforebegin', errorMessage);
            input.addEventListener('input', () => inputValidate(input));
        });

        async function formSend(e) {
            e.preventDefault();

            let error       = formValidate(form);
                formData    = new FormData(form);
            if (formImage) {
                formData.append('image', formImage.files[0]);
            }

            if (error === 0) {
                form.classList.add('form_sending');
                let response = await fetch('sendmail.php', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    let result = await response.json();
                    formPreview.innerHTML = '';
                    form.reset();
                    form.classList.remove('form_sending');
                    formResponse.querySelector('.popup__text').innerHTML = result.message;
                    popupOpen(formResponse);
                } else {
                    form.classList.remove('form_sending');
                    formResponse.querySelector('.popup__text').innerHTML = result.message;
                    popupOpen(formResponse);
                }
            }
        }
    });
}

// Form image
if (formImage) {
    formPreview = formImage.closest('.file').querySelector('.file__preview');
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    });
}

function formValidate(form) {
    let formInput   = form.querySelectorAll('input'),
        error       = 0;

    for (let index = 0; index < formInput.length; index++) {
        error += inputValidate(formInput[index]);
    }

    return error;
}
function inputValidate(input) {
    let     error       = 0;
    const   regEmail    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/,
            regPhone    = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

    // Required empty inputs
    if (input.hasAttribute('data-required') && input.value === '') {
        formAddError(input, 'Заполните обязательное поле');
        error++;
    } else {
        // Email inputs
        if (input.getAttribute('data-input') === 'email') {
            if (!regEmail.test(input.value)) {
                formAddError(input, input.getAttribute('data-error'));
                error++;
            } else {
                formRemoveError(input);
            }
        }
        // Phone inputs
        else if (input.getAttribute('data-input') === 'phone') {
            if (!regPhone.test(input.value)) {
                formAddError(input, input.getAttribute('data-error'));
                error++;
            } else {
                formRemoveError(input);
            }
        }
        // Required checkbox inputs
        else if (input.hasAttribute('data-required') && input.getAttribute('type') === 'checkbox' && input.checked === false) {
            formAddError(input, input.getAttribute('data-error'));
            error++;
        } else {
            formRemoveError(input);
        }
    }
    return error;
}

function formAddError(input, message) {
    input.parentElement.classList.add('form__error');
    input.classList.add('form__error');
    input.parentElement.querySelector('.form__error-message').innerHTML = message;
}
function formRemoveError(input) {
    input.parentElement.classList.remove('form__error');
    input.classList.remove('form__error');
    input.parentElement.querySelector('.form__error-message').innerHTML = '';
}

function uploadFile(file) {
    // Check file format
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        formResponse.querySelector('.popup__text').innerHTML = 'Разрешены только изображения';
        popupOpen(formResponse);
        formImage.value = '';
        return;
    }
    // Check file size(>2mb)
    if (file.size > 2 * 1024 * 1024) {
        formResponse.querySelector('.popup__text').innerHTML = 'Файл дожен быть менее 2 МБ';
        popupOpen(formResponse);
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        formPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.onerror = function(e) {
        formResponse.querySelector('.popup__text').innerHTML = 'Ошибка при загрузке файла. Повторите попытку.';
        popupOpen(formResponse);
    };
    reader.readAsDataURL(file);
}