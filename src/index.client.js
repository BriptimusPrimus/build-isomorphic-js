import Application from './lib';
import HelloController from './HelloController';

const application = new Application({
  '/hello/{name*}': HelloController
}, {
  // query selector for the element in which
  // the controller response should be injected
  target: 'body'
});

application.start();
