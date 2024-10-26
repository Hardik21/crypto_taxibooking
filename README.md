# Project Name

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. Open your command prompt (CMD).
2. Navigate to your project directory:

   ```bash
   cd path/to/your/project
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

Your application should now be running. You can access the API at the specified endpoints.

### API Endpoints

1. **GET** `http://localhost:10000/getSupportedCoins`

2. **POST** `http://localhost:10000/createTransaction`  
   **Request Body (JSON):**
   ```json
   {
       "amount": 1,
       "currency1": "USD",
       "currency2": "LTCT",
       "buyerEmail": "customer_email@gmail.com",
       "customOrderId": "1"
   }
   ```

3. **POST** `http://localhost:10000/storeJSON`  
   **Request Body (JSON):**
   ```json
   {
       "name": "hardik",
       "phone": "1212121212"
   }
   ```

