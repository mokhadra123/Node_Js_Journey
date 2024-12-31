const { log } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')

//////////////////////////////////////////////////
//! Files
//////////////////////////////////////////////////

//! Blocking, synchronous way............
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8' );
// log(textInput);
// const textOutput = `This is what we know about the avocado: ${textInput}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// log('File has been written!');

//! Non-Blocking, asynchronous way...........
// fs.readFile('./txt/stdart.txt', (err, data1) => {
//     if(err) return log(err);

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile(`./txt/final.txt`,`${data2}\n${data3}`, 'utf-8', (err) => {
//                 log('Your file has been written!');
//             });
//         });
//     });
// });
// log('Will read file!');


//////////////////////////////////////////////////
//! SERVER
//////////////////////////////////////////////////



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(prod => replaceTemplate(tempCard, prod)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
        
    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'application/json',
            // 'my-own-header': 'hello-world'
        });
        res.end(JSON.stringify({
            message: 'Page not found!'
        }));
    }
});

server.listen(8000, '127.0.0.1', () => {
    log('Server is listening on port 8000');
});