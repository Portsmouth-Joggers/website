// the folder above /x/ is the site root, wherever the site is being served from
const siteRoot = new URL('../', document.querySelector('script[src$="x/menu.js"]').src);
const isHtmlPreview = location.hostname === 'htmlpreview.github.io';

function sitePath(path) {
  return path.startsWith('/') ? siteRoot.pathname + path.slice(1) : path;
}

// htmlpreview can't follow the @imports in all.css, so load those files here
async function loadPreviewStyles() {
  const cssFolder = new URL('x/', siteRoot);
  const allCss = await (await fetch(new URL('all.css', cssFolder))).text();
  const files = [...allCss.matchAll(/@import url\("(.+?)"\)/g)].map(match => new URL(match[1], cssFolder));
  const sheets = await Promise.all(files.map(file => fetch(file).then(response => response.text())));
  const style = document.createElement('style');
  style.textContent = sheets.join('\n');
  document.head.prepend(style);
}

// htmlpreview only keeps links ending in .html inside the preview, so do the rest here
function linkPreviewPages() {
  for (const anchor of document.querySelectorAll('a[href]')) {
    const url = new URL(anchor.href);
    if (!url.href.startsWith(siteRoot.href)) continue;
    if (/\.\w+$/.test(url.pathname)) continue;
    url.pathname = url.pathname.replace(/\/?$/, '/index.html');
    anchor.href = 'https://htmlpreview.github.io/?' + url.href;
  }
}

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
  let currentUrl = document.baseURI;
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
      anchor.setAttribute('href', sitePath(item.href));

      // Check if 'target' exists in the item and apply it
      if (item.target) {
        anchor.target = item.target;  // Add target to open in a new tab
      } else {
        anchor.target = '_self';  // Default to open in the same tab
      }
      
      if (item.icon) {
        const img = document.createElement('img');
        img.setAttribute('src', sitePath(item.icon));
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

async function initMenu() {
  const menuUrl = ''; // Update this path as needed
  if (isHtmlPreview) loadPreviewStyles();
  await loadMenu(sitePath("/menu.json"));
  if (isHtmlPreview) linkPreviewPages();
}

// auto inject the menu on page load
window.addEventListener('DOMContentLoaded', initMenu);