const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 10000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


const axios = require('axios');
const crypto = require('crypto');

// Replace with your CoinPayments API credentials
const API_KEY = 'b976fd8ee54308963169e4e9f14f2b4d8fa6ec7fa9b7897788034f3b138d2bf5';
const API_SECRET = 'fC78146F185022D0021a76329B9d06cb73804D67734C47DB6bf121562DAAbBfa';

// CoinPayments API URL
const API_URL = 'https://www.coinpayments.net/api.php';

// Function to generate the required HMAC signature
const generateHmacSignature = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return crypto.createHmac('sha512', API_SECRET).update(queryString).digest('hex');
};



app.post('/createTransaction', async (req, res) => {
    const { amount, currency1, currency2, buyerEmail, customOrderId } = req.body;
    const params = {
        key: API_KEY,
        version: 1,
        cmd: 'create_transaction',
        amount: amount,          // Amount in currency1
        currency1: currency1,    // Currency to convert from (e.g., USD)
        currency2: currency2,    // Cryptocurrency to receive (e.g., BTC)
        buyer_email: buyerEmail, // Buyer's email
        ipn_url: 'https://webhook.site/18ed365b-509f-4d58-bb44-d002b5610a22', // Optional: IPN URL for callback
        custom: customOrderId
    };

    // Generate the HMAC signature
    const hmacSignature = generateHmacSignature(params);

    // Send the request to CoinPayments
    try {
        const response = await axios.post(API_URL, new URLSearchParams(params), {
            headers: {
                'HMAC': hmacSignature,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = response.data;

        if (data.error === 'ok') {
            console.log('Transaction created:', data.result);
            //return data.result; // Contains payment URL and other details
            return res.send(data.result);
        } else {
            console.error('Error creating transaction:', data.error);
            return res.send(data.error);
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.send(error.message);
    }
})




// Usage Example
// (async () => {
//   // Replace with the amount, currencies, and email of the buyer
//   const transaction = await createTransaction(100, 'USD', 'LTCT', 'hardikmansaraa@gmail.com');
//   if (transaction) {
//     console.log('Payment URL:', transaction.checkout_url);
//   }
// })();


app.get('/getSupportedCoins', async (req, res) => {
    const params = {
        key: API_KEY,
        version: 1,
        cmd: 'rates',
        short: 0 // Set to 0 to get all supported coins (even those without rates)
    };

    // Generate the HMAC signature
    const hmacSignature = generateHmacSignature(params);

    // Send the request to CoinPayments
    try {
        const response = await axios.post(API_URL, new URLSearchParams(params), {
            headers: {
                'HMAC': hmacSignature,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = response.data;

        if (data.error === 'ok') {
            console.log('Supported Coins:', data.result);
            //return data.result; // Contains list of supported coins
            return res.send(data.result);
        } else {
            console.error('Error fetching supported coins:', data.error);
            return res.send(data.error);
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.send(error.message);
    }
})


// Call the function to get supported coins
// getSupportedCoins();
// const pinataSDK = require('@pinata/sdk');
const { PinataSDK } = require("pinata")
const fs = require('fs');
//const pinata = new pinataSDK('8a653703e62ec8cb9a6a', '13a0328e7804600ee9fe84cf60e813e93add2f9efd1e81d4e3946bc3ea253c93');
const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMzRjZjhkOC1kNWMxLTQxNDQtYTRkOC1lMWExODhkMWI5MjIiLCJlbWFpbCI6ImhhcmRpa21hbnNhcmFhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4YTY1MzcwM2U2MmVjOGNiOWE2YSIsInNjb3BlZEtleVNlY3JldCI6IjEzYTAzMjhlNzgwNDYwMGVlOWZlODRjZjYwZTgxM2U5M2FkZDJmOWVmZDFlODFkNGUzOTQ2YmMzZWEyNTNjOTMiLCJleHAiOjE3NjE0NTk4MTd9.80SF24JrnW4AGQblJ8OOStqq-KRxU1x66i53PJph-Ow",
    pinataGateway: "moccasin-many-turtle-335.mypinata.cloud"
})


app.post('/storeJSON', async (req, res) => {
    const jsonData = req.body;
    try {
        // const result = await pinata.pinJSONToIPFS(jsonData);
        //generat pdf
        await generatePDF(jsonData);
        const blob = new Blob([fs.readFileSync("./output.pdf")]);
        const file = new File([blob], "output.pdf", { type: "text/plain" })
        const upload = await pinata.upload.file(file);
        console.log(upload);
        // res.send(upload);
        res.send({ data: 'http://localhost:3000/readFile?hash=' + upload.cid });
        // res.send({ data: 'https://moccasin-many-turtle-335.mypinata.cloud/ipfs/' + result.IpfsHash });
    } catch (error) {
        console.error('Error setting up Helia:', error)
    }
})


app.get('/readFile', async (req, res) => {
    const _hash = req.query.hash;
    try {
        const file = await pinata.gateways.get(_hash)
        const arrayBuffer = await file.data.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);
        // Set response headers to trigger download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded_file.pdf"');
        // Send the PDF buffer as the response
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error setting up Helia:', error)
        res.send('Error setting up Helia:', error);
    }
})
const PDFDocument = require('pdfkit');


function generatePDF(data, fileName = 'output.pdf') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(fileName);

        doc.pipe(stream);

        function addData(data, indent = '') {
            if (typeof data === 'object' && data !== null) {
                if (Array.isArray(data)) {
                    data.forEach((item, i) => {
                        doc.text(`${indent}- [${i + 1}]`);
                        addData(item, indent + '  ');
                    });
                } else {
                    Object.entries(data).forEach(([key, value]) => {
                        doc.text(`${indent}${key}:`);
                        addData(value, indent + '  ');
                    });
                }
            } else {
                doc.text(`${indent}${data}`);
            }
        }

        addData(data);
        doc.end();
        stream.on('finish', () => {
            resolve();
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
}
