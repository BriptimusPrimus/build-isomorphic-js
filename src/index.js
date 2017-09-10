import Application from './lib';
import HelloController from './HelloController';
import nunjucks from 'nunjucks';
import options from './options';

nunjucks.configure(options.nunjucks);

const application = new Application({
    '/hello/{name*}': HelloController
}, options);

application.start();