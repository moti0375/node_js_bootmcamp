/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();
  console.log('showAlert: ');
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterBegin', markup);
  window.setTimeout(hideAlert, 5000);
};
