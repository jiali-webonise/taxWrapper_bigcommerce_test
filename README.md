# Tax Wrapper

## Prerequisite:

`npm install`

## Installation
1. Clone the git repository.
2. Make sure latest node, npm, and yarn (optional) are installed.
3. Install required node packages from the command line: `npm install` or `yarn install`.
4. Create `.env` file in the root of the app. See Configuration below for more details.
5. Run server from the command line: `npm start` or `yarn run start`.

## To run the app:

`npm start`

## To run the test:

`npm run test`

## To run ngrok customized domain

`ngrok http --domain=taxwrapper.ngrok.app 3000`

## Configuration

### .env file
1. Create a file in the root of the app called `.env`. 
2. Copy `.env.example` to `.env`.
3. Update the `.env` values.

## Available REST API Requests

To view all available REST API requests, please visit the [API Documentation](https://taxwrapper.ngrok.app/api-docs).

## Server Timing Header

The server timing header is a response header that provides information about the server's processing of the request. It is a way to provide more information about the server's processing of the request to the client.

In server.js, if `NODE_ENV=development`, the following code is used to add the server timing header to the response:

```
if (process.env.NODE_ENV === 'development') {
  const serverTimingMiddleware = require('server-timing-header');
  app.use(serverTimingMiddleware({
    sendHeaders: true,
    headers: {server: 'server-timing-header'},
    log: true,
    logLevel: 'info'}));
}
```

To add the server timing header to the response, the following code is used:

```
res.serverTiming.from('name-for-your-timing', 'Descriptive text for your timing');
[...]
res.serverTiming.to('name-for-your-timing');
```

You can place the above code anywhere in the application. The above code will add the server timing header to the response between the two lines of code.

Make sure you give each timing a unique name. If you do not give each timing a unique name, the server timing header will not be added to the response.

You can also add a more descriptive text to the server timing header. This is optional but will display your timing in the browser Network tab with a more human-readable title.

![Server Timing in Browser](img/server-timings/server-timing-browser1b.png "Server Timing in Browser")

**More Information:**<br/>
[Server Timing Header Package](https://www.npmjs.com/package/server-timing-header)<br/>
[Server Timing Web Doc from Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)<br/>
[Servers Timing Header Specification from W3C](https://w3c.github.io/server-timing/)


### Server Timing Header Compatibility

In order to view the server timing header,res.serverTiming.end('server-timing-header'); you must use a browser that supports the server timing header. The following browsers support the server timing header:

* Chrome 61+
* Firefox 61+
* Safari 11.1+
* Opera 48+
* Edge 16+
* Internet Explorer 11+
* Android 7.0+
* iOS 11.3+
* Chrome for Android 61+
* Firefox for Android 61+
* Opera for Android 48+
* Samsung Internet 6.2+
* Chrome for iOS 61+
* Firefox for iOS 10.0+
* Opera Mini 12.0+
* Opera Mobile 48+
* Samsung Internet for Android 6.2+
* Samsung Browser 4.0+
* Firefox Reality 8.0+
* Oculus Browser 6.0+
* Samsung Internet for Gear VR 6.2+
