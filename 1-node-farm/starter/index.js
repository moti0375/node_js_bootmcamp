const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////// Files ///////////////////////////
// const filePath = './txt/input.txt';
// const startFilePath = './txt/start.txt';

// //Blocking synchronous way
// // const text = fs.readFileSync(filePath, 'utf-8');
// // console.log(text);
// // const textOut = `This is what we know about the avocado: ${text}.\nCreated on date ${Date.now()}`;
// // fs.writeFileSync('./txt/output.txt', textOut);
// // console.log("Write to file success");

// //Non-blocking asyncronous way
// fs.readFile(startFilePath, (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, (err, data2) => {
//         console.log(`Just read: ${data2}`)
//         fs.readFile('./txt/append.txt', (err, data3) => {
//             console.log(`Just read: ${data3}`)

//             fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log(`File has been written`);
//             })
//         })
//     })
// })
// console.log(`Reading file...`);

// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const dataObj = JSON.parse(data);

console.log(slugify('Fresh Avocados', { lower: true }));
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);

  console.log(query);
  console.log(`pathname: ${pathname}`);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const htmlCards = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    // console.log(`Cards: ${htmlCards}`);
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, htmlCards);
    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === '/data') {
    // console.log(dataObj)
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello World'
    });
    res.end('<h1>The page cannot be found</h1>');
  }
});

server.listen(8000, '127.0.0.1', err => {
  if (err != null) {
    console.log('There was an error: ' + err);
  }
  console.log('Listeninig to requests on port 8000');
});
