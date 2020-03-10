const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        err.message = 'Could not find that file! 😞';
        reject(err);
      }
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('dogs-image.txt', data, err => {
      if (err) {
        err.message = 'Could not write a file! 😞';
        reject(err);
      }
      resolve('Success');
    });
  });
};

/* Use promises
readFilePro(`${__dirname}/dogi.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(data => {
    console.log('Dog image url: ' + data.body.message);
    return writeFilePro('dogs-image.txt', data.body.message);
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err.message));
*/

/* Use callbacks
readFilePro(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    superagent
      .get(`https://dog.ceo/api/breed/${data}/images/random`)
      .then(response => {
        console.log(response.body.message);
        writeFilePro('dogs-image.txt')
          .then(result => {
            console.log('Saved: ' + response.body.message);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
  */

//Async await

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed : ${data}`);

    const pro1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const pro2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const pro3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([pro1, pro2, pro3]);

    const imgs = all.map(it => it.body.message);

    // const imageUrl = await superagent.get(
    //   `https://dog.ceo/api/breed/${data}/images/random`
    // );
    console.log(imgs);

    const writeStatus = await writeFilePro('dogs-image.txt', imgs.join('\n'));
    console.log(`Write status : ${writeStatus}`);
  } catch (err) {
    console.log(err.message);
    throw err;
  }

  return '2: READY 🐶';
};

/* Use async function 
console.log('1: Getting dog pics');
getDogPic()
  .then(x => {
    console.log(x);
    console.log('3: Getting dog pics done');
  })
  .catch(err => console.log(`${err.message} 🎇`));
*/

//Anonymously async function
console.log('0: Running async function');
(async () => {
  try {
    console.log('1: Getting dog pics');
    const dogstatus = await getDogPic();
    console.log(dogstatus);
    console.log('3: Getting dog pics done');
  } catch (err) {
    console.log(`Error: 💥`);
  }
})();
console.log('4: async function done');
