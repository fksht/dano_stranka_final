// app.js

import routes from './routes.js';

function findComponentByPath(path, routes) {
  const repoName = "/dano_stranka_final"; // ZMEŇTE NA MENO REPO
  const cleanPath = path.replace(repoName, ""); // Odstráni repo z cesty
  return routes.find(r => r.path === cleanPath);
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
  // Obnovenie cesty po presmerovaní z 404.html
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== location.pathname) {
    history.replaceState(null, null, redirect);
  }
  router();

  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // ROUTING
    if (target.tagName === 'A' && target.getAttribute('href').startsWith('/')) {
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