/* eslint-disable */
import '@babel/polyfill'; //Used to support older browsers for running js
import { displayMap } from './mapbox.js';
import { login } from './login.js';

//Values
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
