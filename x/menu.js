async function loadMenu(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    renderMenu(data);
  } catch (error) {
    console.error('Failed to load menu data:', error);
  }
}

function highlightCurrent(item, currentUrl) {
  const href = item.getAttribute('href');
  const xhref = href.endsWith('/') ? href.slice(0, -1) : href;

  // remove trailing "index.html" from currentUrl if present
  if (currentUrl.endsWith('index.html')) {
    currentUrl = currentUrl.slice(0, -10);
  }

  // remove trailing "/" from currentUrl
  currentUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;

  if (xhref.length === 0) {
    if (location.pathname.length === 1) {
      item.classList.add('current');
    }
  } else {
    if (currentUrl.endsWith(xhref)) {
      item.classList.add('current');
    }
  }
}

function renderMenu(data) {
  let currentUrl = window.location.href;
  // if there is a trailing "/" strip it
  if (currentUrl.endsWith('/')) {
    currentUrl = currentUrl.slice(0, -1);
  }

  const nav = document.createElement('nav');

  for (const section of data) {
    const sectionNav = document.createElement('nav');
    const h2 = document.createElement('h2');
    h2.textContent = section.title;
    sectionNav.append(h2);

    for (const item of section.items) {
      const anchor = document.createElement('a');
      anchor.textContent = item.text;
      anchor.setAttribute('href', item.href);
      if (item.icon) {
        const img = document.createElement('img');
        img.setAttribute('src', item.icon);
        img.setAttribute('alt', 'icon');
        img.classList.add('icon');
        anchor.prepend(img);
      }

      highlightCurrent(anchor, currentUrl);

      sectionNav.append(anchor);
    }

    nav.append(sectionNav);
  }

  nav.classList.add('menu');
  document.body.prepend(nav);
}

function initMenu() {
  const menuUrl = ''; // Update this path as needed
  loadMenu("/menu.json");
}

// auto inject the menu on page load
window.addEventListener('DOMContentLoaded', initMenu);