// app.js
import routes from './routes.js';

// --- Funkcie pre routing (BEZ ZMENY) ---
function findComponentByPath(path, routes) {
  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return routes.find(r => r.path === cleanPath);
}

function router() {
  const path = window.location.pathname;
  const route = findComponentByPath(path, routes);

  const header = document.getElementById('page-header');
  const routerView = document.getElementById('router-view');
  const sliderContainer = document.getElementById('slider-container');

  if (!route) {
    console.warn(`Route not found for path: ${path}. Redirecting to home.`);
    window.history.replaceState({}, '', '/');
    // Predpokladáme, že domovská routa má target 'template-welcome'
    const welcomeRoute = findComponentByPath('/', routes);
    if (welcomeRoute && routerView) {
        // V pôvodnom kóde bola logika tu, ale závisela od routes.js
        // Pre jednoduchosť použijeme priamy prístup k šablóne, ak je to možné
        const welcomeTemplate = document.getElementById("template-welcome");
        if (welcomeTemplate) {
            routerView.innerHTML = welcomeTemplate.innerHTML;
        } else {
             console.error("Welcome template ('template-welcome') not found!");
             routerView.innerHTML = '<p>Obsah nenájdený.</p>';
        }

    } else {
      console.error("Welcome route '/' not found or router view not found!");
      if (routerView) routerView.innerHTML = '<p>Obsah nenájdený.</p>';
    }
    if (sliderContainer) sliderContainer.style.display = 'block';
  } else {
    if (routerView) {
      // Pôvodný kód tu volal route.getTemplate(route.target);
      // Ak to fungovalo, necháme to tak. Ak nie, treba použiť inú metódu
      // na vloženie obsahu šablóny (ako v mojej predchádzajúcej odpovedi).
      // Pre istotu predpokladáme, že routes.js exportuje funkciu getTemplate
      // alebo ju pridáva k objektu route. Ak nie, treba upraviť.
      if (typeof route.getTemplate === 'function') {
          route.getTemplate(route.target); // Ponechávame pôvodné volanie
      } else {
          // Alternatíva, ak getTemplate neexistuje:
          const template = document.getElementById(route.target);
          if (template && template.content) {
              const clone = template.content.cloneNode(true);
              routerView.innerHTML = '';
              routerView.appendChild(clone);
          } else {
              console.error(`Template element with ID "${route.target}" not found!`);
              routerView.innerHTML = '<p>Chyba: Šablóna nebola nájdená.</p>';
          }
      }

      if (sliderContainer) sliderContainer.style.display = (route.path === '/') ? 'block' : 'none';
    } else {
      console.error("Router view element not found!");
    }
  }

  // Zatvoriť mobilné menu pri navigácii (BEZ ZMENY)
  if (header && header.classList.contains('active')) {
    header.classList.remove('active');
    document.body.classList.remove('no-scroll'); // scroll späť
  }

  // Zatvoriť všetky submenu na mobile (BEZ ZMENY)
  document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
    if (window.innerWidth <= 900) {
      item.classList.remove('active');
    }
  });

  // Scroll na vrch stránky (PRIDANÉ pre lepšiu UX)
  window.scrollTo(0, 0);
}

function navigateTo(path) {
  // Zabezpečenie, že path je platný string (PRIDANÉ pre robustnosť)
  if (typeof path !== 'string') {
      console.error("navigateTo called with invalid path:", path);
      return;
  }
  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const currentCleanPath = window.location.pathname.length > 1 && window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname;

  if (currentCleanPath !== cleanPath) {
    window.history.pushState({}, '', cleanPath);
    router(); // Zavoláme router na vykreslenie a update menu
  } else {
    // Ak sme už na ceste, len zavrieme mobilné menu, ak je otvorené (UPRAVENÉ)
    console.log(`Already on path: ${cleanPath}. Closing menu if open.`);
    const header = document.getElementById('page-header');
    if (header && header.classList.contains('active')) {
      header.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
          if (window.innerWidth <= 900) item.classList.remove('active');
      });
    }
     // Scroll na vrch aj pri kliku na rovnaký link (PRIDANÉ)
     window.scrollTo(0, 0);
  }
}

// --- Inicializácia a Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('page-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!header) console.error("Header element (#page-header) not found!");
  if (!menuToggle) console.error("Menu toggle button (#menu-toggle) not found!");
  if (!mainNav) console.error("Main navigation element (.main-nav) not found!");

  // === HLAVNÁ ÚPRAVA: Zmena v globálnom listeneri ===
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a'); // Nájdi najbližší <a> element

    // --- Hamburger Menu Toggle (Presunuté sem pre lepšiu logiku) ---
    if (menuToggle && (menuToggle === e.target || menuToggle.contains(e.target))) {
        e.stopPropagation(); // Zabráni zatvoreniu menu hneď po otvorení
        header.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        // Ak zatvárame menu, zatvoríme aj všetky otvorené submenu
        if (!header.classList.contains('active')) {
            document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
        return; // Ukončíme spracovanie pre hamburger
    }


    // --- Spracovanie kliknutí na odkazy ---
    if (link) {
        const href = link.getAttribute('href');
        const isInternalNav = href && href.startsWith('/'); // Je to interný odkaz?
        const isAnchor = href && href.startsWith('#'); // Je to kotva?
        const isSpecialization = link.closest('.specialization-block'); // Je to blok špecializácie?
        const isDropdownToggle = link.classList.contains('dropdown-toggle'); // Je to hlavný odkaz dropdownu?
        const isMobile = window.innerWidth <= 900; // Sme na mobile?
        const isArrowClick = e.target.matches('span.arrow'); // Kliklo sa na šípku?
        const isExternal = link.target === '_blank' || (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'));
        const isMailOrTel = href && (href.startsWith('mailto:') || href.startsWith('tel:'));

        // Ignoruj externé, kotvy, maily, telefóny (nechaj prehliadač)
        if (isExternal || isAnchor || isMailOrTel) {
            // Ak je menu otvorené a kliklo sa na takýto link v menu, zavri menu
             if (header && header.classList.contains('active') && mainNav.contains(link)) {
                  header.classList.remove('active');
                  document.body.classList.remove('no-scroll');
                  document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
                      item.classList.remove('active');
                  });
             }
            console.log('Browser handles this link:', href);
            return;
        }

        // Späť tlačidlo (ak je to <a>)
        if (href && link.matches('.training-info .btn_main') && link.textContent.includes('< Späť')) {
             e.preventDefault();
             window.history.back();
             return;
        }
         // Späť tlačidlo (ak je to <button>) - pridaj kontrolu, ak to môže byť button
         if (e.target.matches('.training-info .btn_main') && e.target.tagName === 'BUTTON' && e.target.textContent.includes('< Späť')) {
            e.preventDefault();
            window.history.back();
            return;
        }

        // Špecializácie
        if (isSpecialization) {
            e.preventDefault();
            navigateTo(href);
            return;
        }

        // === KĽÚČOVÁ LOGIKA PRE DROPDOWN NA MOBILE ===
        if (isDropdownToggle && isMobile) {
            if (isArrowClick) {
                // Klik na šípku -> Otvor/Zatvor submenu
                e.preventDefault(); // Zabrániť navigácii odkazu
                e.stopPropagation(); // Zastaviť ďalšie spracovanie kliku
                const parentLi = link.closest('li.dropdown');
                if (parentLi) {
                    parentLi.classList.toggle('active');
                    // Zatvor ostatné aktívne submenu na rovnakej úrovni
                    const siblings = parentLi.parentNode.children;
                    for (let sibling of siblings) {
                        if (sibling !== parentLi && sibling.classList.contains('dropdown') && sibling.classList.contains('active')) {
                            sibling.classList.remove('active');
                        }
                    }
                }
            } else {
                // Klik na text "Služby" (nie na šípku) -> Naviguj
                e.preventDefault(); // Zabrániť štandardnej akcii odkazu
                navigateTo(href); // Použi náš router na navigáciu
            }
            return; // Ukončíme spracovanie pre dropdown toggle na mobile
        }

        // Ostatné interné odkazy (BEZ ZMENY V PODSTATE, len sa sem dostanú aj linky z dropdownu na desktope)
        // Zahŕňa normálne odkazy, odkazy v submenu (aj na mobile), odkazy v pätičke atď.
        if (isInternalNav) {
            e.preventDefault();
            navigateTo(href);
            return;
        }

        // Ak sme sa dostali sem, pravdepodobne to nebol odkaz, ktorý chceme spracovať.
        console.log('Unhandled link click:', link);
    }

    // --- Zatvorenie Mobilného Menu Kliknutím Mimo (Presunuté sem) ---
    // Ak je menu otvorené a klik nebol ani na hamburger, ani do navigácie
     if (header && mainNav && menuToggle && header.classList.contains('active')) {
       const isClickInsideNav = mainNav.contains(e.target);
       const isClickOnToggle = menuToggle.contains(e.target); // Kontrolu sme už spravili hore, ale pre istotu

       if (!isClickInsideNav && !isClickOnToggle) {
         header.classList.remove('active');
         document.body.classList.remove('no-scroll');
         // Zatvoríme aj submenu pri kliknutí mimo
         document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
           item.classList.remove('active');
         });
       }
     }

  }); // Koniec globálneho listenera

  // === ODSTRÁNENIE PÔVODNÉHO PROBLEMATICKÉHO LISTenera ===
  /* TENTO BLOK SA ODSTRAŇUJE ALEBO ZAKOMENTUJE:
  if (mainNav) {
    mainNav.addEventListener('click', (e) => {
      const toggleLink = e.target.closest('li.dropdown > a.dropdown-toggle');
      const isMobile = window.innerWidth <= 900;

      if (toggleLink && isMobile) {
        e.preventDefault();
        e.stopPropagation();

        const parentLi = toggleLink.closest('li.dropdown');
        if (parentLi) {
          parentLi.classList.toggle('active');

          const siblings = parentLi.parentNode.children;
          for (let sibling of siblings) {
            if (sibling !== parentLi && sibling.classList.contains('dropdown') && sibling.classList.contains('active')) {
              sibling.classList.remove('active');
            }
          }
        }
      }
    });
  }
  */

  // === PÔVODNÝ LISTENER PRE ZATVORENIE MENU KLIKNUTÍM MIMO (Teraz je integrovaný v hlavnom listeneri) ===
  /* TENTO BLOK SA ODSTRAŇUJE ALEBO ZAKOMENTUJE:
  document.addEventListener('click', (e) => {
    if (header && mainNav && menuToggle && header.classList.contains('active')) {
      const isClickInsideNav = mainNav.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);

      if (!isClickInsideNav && !isClickOnToggle) {
        header.classList.remove('active');
        document.body.classList.remove('no-scroll'); // scroll späť
        document.querySelectorAll('nav.main-nav ul li.dropdown.active').forEach(item => {
          item.classList.remove('active');
        });
      }
    }
  });
  */

  // === PÔVODNÝ LISTENER PRE HAMBURGER (Teraz je integrovaný v hlavnom listeneri) ===
  /* TENTO BLOK SA ODSTRAŇUJE ALEBO ZAKOMENTUJE:
  if (menuToggle && header) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      header.classList.toggle('active');
      document.body.classList.toggle('no-scroll'); // scroll lock toggle
    });
  }
  */


  // Listener pre zmenu histórie (BEZ ZMENY)
  window.addEventListener('popstate', router);

  // Spustíme router pre počiatočné načítanie (BEZ ZMENY)
  router();
}); // Koniec DOMContentLoaded