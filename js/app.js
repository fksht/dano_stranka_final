import routes from './routes.js'; // Import the routes array

class ParamHashRouter {
    constructor(routes, inithash) {
        this.routes = routes;

        window.addEventListener("hashchange", event => this.doRouting(event));

       // Use the inithash instead of setting location
        if(!window.location.hash) {
           window.location.hash = inithash; // Set initial hash if no hash exists
        }
        this.doRouting(); // Call routing immediately during construction
    }

    doRouting() {
        let hash = window.location.hash;
        if (hash) {
            hash = hash[0] === '#' ? hash.substr(1) : hash;
            let hashParts = hash.split("/");
            const matchingRoute = this.routes.find(route => route.hash === hashParts[0]);

            if (matchingRoute) {
                hashParts.shift(); // Remove the route hash
                matchingRoute.getTemplate(matchingRoute.target, ...hashParts); // Pass parameters
            } else {
               document.getElementById('router-view').innerHTML = '<p>404 Not Found</p>';
            }
        } else {
              // Handle the case where there is no hash on initial load
               const matchingRoute = routes.find(route => route.hash === 'welcome');
                if (matchingRoute) {
                    matchingRoute.getTemplate(matchingRoute.target); // Load welcome by default
                 }
        }
    }
}

// Initialize the router
document.addEventListener('DOMContentLoaded', () => {
    const router = new ParamHashRouter(routes, 'welcome'); // Start with 'welcome' route

    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    if (closeBtn && menu) {
        closeBtn.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    }

    document.addEventListener('click', function(event) {
        // Skontroluj, či menu a toggle existujú
        if (menu && toggle) {
            const clickedOutside = !menu.classList.contains('hidden') &&
                                   !menu.contains(event.target) &&
                                   !toggle.contains(event.target);

            if (clickedOutside) {
                menu.classList.add('hidden');
            }
        }
    });
});