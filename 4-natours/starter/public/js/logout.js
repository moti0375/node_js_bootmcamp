/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const logout = async () => {
  console.log('logout function was called');
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logout sucess');
      window.setTimeout(() => {
        location.assign('/login');
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
