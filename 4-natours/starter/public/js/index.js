/* eslint-disable */
import '@babel/polyfill'; //Used to support older browsers for running js
import { displayMap } from './mapbox.js';
import { login } from './login.js';
import { logout } from './logout.js';
import { updateData } from './updateSettings.js';

//Values
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form_login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateSettingsSubmit = document.querySelector('.form-user-data');
const userPasswordForma = document.querySelector('.form-user-settings');

if (loginForm) {
  console.log('Login form exists');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(`Submit button clicked: email: ${email}, password: ${password}`);
    login(email, password);
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (logoutButton) {
  console.log('Found logout button');
  logoutButton.addEventListener('click', e => {
    console.log('Logout button clicked');
    logout();
  });
}

if (updateSettingsSubmit) {
  console.log('updateSettingsSubmit: found');
  updateSettingsSubmit.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Submit data button clicked');
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    const photo = document.getElementById('photo').value;
    console.log(`Submit button clicked: name: ${name}, email: ${email}, file: ${photo}`);
    updateData(form, 'details');
  });
}

if (userPasswordForma) {
  console.log('updatePasswordSubmit found');
  userPasswordForma.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    console.log('Submit data button clicked');
    const oldPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    console.log(
      `Submit password clicked: oldPassword: ${oldPassword}, newPassword: ${newPassword}, confirmPassword: ${confirmPassword}`
    );

    await updateData(
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      },
      'password'
    );

    //Clear the fields after action complete
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
  });
}
