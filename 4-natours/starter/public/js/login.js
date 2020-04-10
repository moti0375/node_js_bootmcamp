/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  //   alert(email, password);
  console.log(`login was called, about to login.. email: ${email}, password: ${password}`);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email: `${email}`,
        password: `${password}`
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Login sucess');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
  } catch (e) {
    // console.log(e.response.data);
    if (e.response.data) {
      showAlert('error', e.response.data.message);
    } else {
      showAlert('error', 'There was an error, try again later..');
    }
  }
};
