const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Tax Wrapper Express API with Swagger',
      version: '0.1.0',
      description: 'This is a simple API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Webonise Lab',
        url: 'https://www.webonise.com/',
        email: 'letstalk@webonise.com',
      },
    },
    servers: [
      {
        // url: "http://localhost:3000/api",
        url: 'https://taxwrapper.ngrok.app/api',
      },
    ],
  },
  apis: ['./app/routes/*.js'],
};

module.exports = options;
