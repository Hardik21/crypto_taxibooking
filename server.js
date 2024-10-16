const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

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
    const { amount, currency1, currency2, buyerEmail } = req.body;
    const params = {
        key: API_KEY,
        version: 1,
        cmd: 'create_transaction',
        amount: amount,          // Amount in currency1
        currency1: currency1,    // Currency to convert from (e.g., USD)
        currency2: currency2,    // Cryptocurrency to receive (e.g., BTC)
        buyer_email: buyerEmail, // Buyer's email
        ipn_url: 'https://webhook.site/1940a23c-e56a-478d-acb8-c0f371c1768c', // Optional: IPN URL for callback
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