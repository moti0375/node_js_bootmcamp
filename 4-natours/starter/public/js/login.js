/* eslint-disable */
const login = async (email, password) => {
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
    console.log(res);
  } catch (e) {
    console.log(e.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(`Submit button clicked: email: ${email}, password: ${password}`);
  login(email, password);
});
