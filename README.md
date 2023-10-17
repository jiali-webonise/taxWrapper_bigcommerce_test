# Tax Wrapper
Tax Wrapper is a express app that supports BC Single-Click App and BC Tax Provider API. This app will handle tax estimates, commits and other expected tax actions.
## Prerequisite:
Node 16   
NPM 8
## Installation
1. Clone the git repository.
2. Make sure latest node(>=16.0.0), npm(>= 8.15.1), or yarn (optional) are installed.
3. Install required node packages from the command line: `npm install` or `yarn install`.
4. Create `.env` file in the root of the app. See Configuration below for more details.
5. Run server from the command line: `npm start` or `yarn run start`.

## To run the app:

`npm start`

## To run the test:

`npm run test`

## To run the app using ngrok customized domain
[Test locally with ngrok](https://developer.bigcommerce.com/api-docs/apps/guide/development#testing-locally-with-ngrok), run this script in terminal:   
```
ngrok http --domain=taxwrapper.ngrok.app 3000
```
Then run `npm start`

## Configuration

### .env file
1. Create a `.env` file in the root of the app. 
2. Copy `.env.example` to `.env`.
3. Update the `.env` values.

## Available REST API Requests

To view all available REST API requests, please visit the [API Documentation](https://taxwrapper.ngrok.app/api-docs).

## Deployment
Update the `.env` values.  
1. Update DEV_MODE = false and PORT  
2. Set AUTH_CALLBACK using the new URL  
3. Set SWAGGER_URL using the new URL  


