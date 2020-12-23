'use strict';

const header = document.getElementById('header'),
  burger = header.querySelector('.header__burger'),
  headerMenu = header.querySelector('.header__menu'),
  menuClose = headerMenu.querySelector('.header__menu-close'),
  form = document.getElementById('form'),
  formInputs = document.querySelectorAll('form > input'),
  formBtn = form.querySelector('.request-form__button'),
  popup = document.querySelector('.popup'),
  popupTitle = popup.querySelector('.popup__title'),
  popupBtn = popup.querySelector('.popup__button');

header.addEventListener('click', (e) => {
  const target = e.target;
  if (target === burger) {
    headerMenu.style.display = 'flex';
  } else if (target === menuClose || target.className === 'header__menu-item') {
    headerMenu.style.display = 'none';
  }
});

form.addEventListener('input', e => {
  const target = e.target;
  if (target.getAttribute('name') === 'name') {
    target.value = target.value.replace(/[^а-яa-zA-ZА-ЯёЁё\-]/g, '');
  }
  if (target.getAttribute('name') === 'phone') {
    target.value = target.value.replace(/[^\d+]/g, '');
    (target.value[0] === '+') ? target.value = target.value.slice(0, 12) : target.value = target.value.slice(0, 11);
  }
});

const formHelper = () => {
  popup.style.display = 'block';
  formInputs.forEach(item => {
    if (item.value !== '') {
      item.value = '';
    }
  });
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

const sendForm = () => {
  const formData = new FormData(form);

  let body = {};

  formData.forEach((val, key) => {
    body[key] = val;
  });

  const postData = body => {
    return fetch('./server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  postData(body).then(response => {
    if (response.status !== 200) {
      throw new Error('status network not 200.');
    }
    formHelper();
  }).catch(error => {
    popupTitle.textContent = 'Ошибка! Свяжитесь по телефону';
    formHelper();
    console.log(error)
  });
};

popupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

form.addEventListener('submit', e => {
  e.preventDefault();
  sendForm();
});

AOS.init();