import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type) => {
  //   alert(email, password);
  console.log(`updateSettings called, about to upodate user data: ${JSON.stringify(data)}`);

  let url = 'http://127.0.0.1:3000/api/v1/users/updateMe';
  if (type === 'password') {
    url = 'http://127.0.0.1:3000/api/v1/users/updatePassword';
  }

  try {
    const res = await axios({
      method: 'PATCH',
      url: url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Details updated');
      window.setTimeout(() => {
        location.reload();
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
