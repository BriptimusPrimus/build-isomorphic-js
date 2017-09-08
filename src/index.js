import Hapi from 'hapi';
import Application from './lib';
import Controller from './lib/controller';
import HelloController from './HelloController';
import nunjucks from 'nunjucks';
import Inert from 'inert';

// configure nunjucks to read from the dist directory
nunjucks.configure('./dist');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});
server.register(Inert, () => {});

const APP_FILE_PATH = '/application.js';
const application = new Application({
    '/': Controller,
    '/hello/{name*}': HelloController
}, {
    server: server,
    document: function (application, controller, request, reply, body, callback) {
        nunjucks.render('./index.html', {
            body: body,
            application: APP_FILE_PATH
        }, (err, html) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, html);
        });
    }
});

server.route({
  method: 'GET',
  path: APP_FILE_PATH,
  handler: (request, reply) => {
    reply.file('dist/build/application.js');
  }
});

// Start the server
server.start();