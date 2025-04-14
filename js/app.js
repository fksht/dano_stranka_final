// app.js
import routes from './routes.js';

function findComponentByPath(path, routes) {
  return routes.find(r => r.path === path);
}

function router() {
  const path = window.location.pathname;
  const route = findComponentByPath(path, routes);

  if (!route) {
    window.history.replaceState({}, '', '/');
    document.getElementById('router-view').innerHTML = document.getElementById("template-welcome").innerHTML;
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

  // Pôvodný kód pre klikanie na karty
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('.specialization-block');
    if (target) {
      e.preventDefault();
      const href = target.getAttribute('href');
      window.history.pushState({}, '', href);
      router();
    }
  });

  // Hlavný event listener pre menu
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    const menu = document.getElementById('mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu'); // Pre lepšiu čitateľnosť

    // ROUTING
    if (target.tagName === 'A' && target.getAttribute('href').startsWith('/') && !target.hash) {
      navigateTo(e);
      menu.classList.add('hidden');
    }

    // MENU TOGGLE
    const toggleButton = e.target.closest('#menu-toggle');
    if (toggleButton) {
      menu.classList.toggle('hidden');
    }

    // DROPDOWN TOGGLE (NOVÁ ČASŤ)
    const menuParent = e.target.closest('.menu-parent');
    if (menuParent) {
      e.preventDefault();
      menuParent.classList.toggle('active');
      
      // Zatvoriť ostatné dropdowny
      document.querySelectorAll('.menu-parent').forEach(item => {
        if (item !== menuParent) item.classList.remove('active');
      });
    }

    // Zatvorenie menu po kliknutí na subpoložku
    if (target.closest('.menu-child a')) {
      mobileMenu.classList.add('hidden');
      document.querySelectorAll('.menu-parent').forEach(item => {
        item.classList.remove('active');
      });
    }

    // Zatvorenie dropdownu pri kliknutí mimo
    if (!target.closest('.menu-parent') && !target.closest('.menu-child')) {
      document.querySelectorAll('.menu-parent').forEach(item => {
        item.classList.remove('active');
      });
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