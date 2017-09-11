import Call from 'call';
import query from 'query-string';
import cookie from './cookie.client';
import replyFactory from './reply.client';

export default class Application {

    constructor(routes, options) {
        // save routes as lookup table for controllers
        this.routes = routes;
        this.options = options;
        // create a call router instance
        this.router = new Call.Router();
        this.registerRoutes(routes);
    }

    registerRoutes(routes) {
        // loop through routes and add them
        // to the call router instance
        for (let path in routes) {
            this.router.add({
                path: path,
                method: 'get'
            });
        }
    }

    navigate(url, push=true) {
        // if browser does not support the History API
        // then set location and return
        if (!history.pushState) {
            window.location = url;
            return;
        }

        // split the path and search string
        let urlParts = url.split('?');
        // destructure URL parts array
        let [path, search] = urlParts;
        // see if URL path matches route in router
        let match = this.router.route('get', path);
        // destructure the route path and params
        let { route, params } = match;
        // look up Controller class in routes table
        let Controller = this.routes[route];

        // if a route was matched and Controller class
        // was in the routes table then create a
        // controller instance
        if (route && Controller) {
            const controller = new Controller({
                query: query.parse(search),
                params: params,
                cookie: cookie
            });

            // request and reply stubs; facades will be
            // implemented in the next chapter
            const request = () => {};
            const reply = replyFactory(this);

            // execute controller action
            controller.index(this, request, reply, (err) => {
                if (err) {
                    return reply(err);
                }

                // render controller response
                controller.render(this.options.target, (err, response) => {
                    if (err) {
                        return reply(err);
                    }

                    reply(response);
                });
            });
        }

        console.log(url);

        // only push history stack if push
        // argument is true
        if (push) {
            history.pushState({}, null, url);
        }
    }

    start() {
        // create event listener popstate
        this.popStateListener = window.addEventListener('popstate', (e) => {
            let { pathname, search} = window.location;
            let url = `${pathname}${search}`;
            this.navigate(url, false);
        });

        // create click listener that delegates to navigate method
        // if it meets the criteria for executing
        this.clickListener = document.addEventListener('click', (e) => {
            let { target } = e;
            let identifier = target.dataset.navigate;
            let href = target.getAttribute('href');

            if (identifier !== undefined) {
                // if user clicked on an href then prevent
                // the default browser action (loading a new HTML doc)
                if (href) {
                    e.preventDefault();
                }

                // navigate using the identifier if one was defined.
                // or the href
                this.navigate(identifier || href);
            }
        });        
    }

}