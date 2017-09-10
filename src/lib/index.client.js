export default class Application {

    navigate(url, push=true) {
        // if browser does not support the History API
        // then set location and return
        if (!history.pushState) {
            window.location = url;
            return;
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