// app.js

import routes from './routes.js';

function findComponentByPath(path, routes) {
  return routes.find(r => r.path === path);
}

function router() {
  const path = window.location.pathname;
  const route = findComponentByPath(path, routes);

  if (!route) {
    document.getElementById('router-view').innerHTML = `<h2>Stránka "${path}" neexistuje</h2>`;
    return;
  }

  route.getTemplate(route.target);
}

function navigateTo(event) {
  event.preventDefault();
  const href = event.target.getAttribute('href');
  window.history.pushState({}, '', href);
  router();
}

document.addEventListener('DOMContentLoaded', () => {
  router();

  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // ROUTING
    /*if (target.tagName === 'A' && target.getAttribute('href').startsWith('/')) {*/
    if (target.tagName === 'A' && target.getAttribute('href').startsWith('/') && !target.hash) {
      navigateTo(e);
    }

    // MENU TOGGLE
    const toggleButton = e.target.closest('#menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (toggleButton) {
      menu.classList.toggle('hidden');
    }

    // CLOSE MENU (X button)
    const closeButton = e.target.closest('#close-menu');
    if (closeButton) {
      menu.classList.add('hidden');
    }

    // CLOSE MENU (click outside)
    const isClickInsideMenu = menu.contains(target);
    const isClickOnToggle = toggleButton !== null;
    
    if (!menu.classList.contains('hidden') && !isClickInsideMenu && !isClickOnToggle) {
      menu.classList.add('hidden');
    }
  });

  window.addEventListener('popstate', router);
});
