// this commented code works on 'newer' browsers, but to cope with
// folks who have obsoluete hardware we need to hard code the folder 
// const url = new URL(import.meta.url, window.location);
// const folder = url.pathname.split('/').slice(0, -1).join('/');
const folder = '/x';
const styleUrl = `${folder}/menu.css`;

class JsonMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['href'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'href') {
      this.loadMenu(newValue);
    }
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    if (href) {
      this.loadMenu(href);
    }
  }

  async loadMenu(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.renderMenu(data);
    } catch (error) {
      console.error('Failed to load menu data:', error);
    }
  }

  highlightCurrent(item, currentUrl) {
    const href = item.getAttribute('href');
    const xhref = href.endsWith('/') ? href.slice(0, -1) : href;

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


  renderMenu(data) {
    let currentUrl = window.location.href;
    // if there is a trailing "/" strip it
    if (currentUrl.endsWith('/')) {
      currentUrl = currentUrl.slice(0, -1);
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('${styleUrl}');
      </style>
    `;

    const div = document.createElement('div');
    for (const section of data) {
      const nav = document.createElement('nav');
      const h2 = document.createElement('h2');
      h2.textContent = section.title;
      nav.append(h2);

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

        this.highlightCurrent(anchor, currentUrl);

        nav.append(anchor);
      }

      div.append(nav);
    }
    this.shadowRoot.append(div);

  }
}

function initMenu() {
  let menu = document.querySelector('json-menu');
  if (!menu) {
    menu = document.createElement('json-menu');
    menu.setAttribute('href', '/menu.json');
    document.body.prepend(menu);
  }

}


customElements.define('json-menu', JsonMenu);

// auto inject the menu on page load
window.addEventListener('DOMContentLoaded', initMenu);

