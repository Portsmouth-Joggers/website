const url = new URL(import.meta.url, window.location);
const folder = url.pathname.split('/').slice(0, -1).join('/');
const styleUrl = `${folder}/menu.css`;
const menuItemStyleUrl = `${folder}/menu-item.css`;


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

  renderMenu(data) {
    // use the current folder of this script to load the menu
    

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
        const menuItem = document.createElement('menu-item');
        menuItem.setAttribute('text', item.text);
        menuItem.setAttribute('href', item.href);
        if (item.icon) {
          menuItem.setAttribute('icon', item.icon);
        }
        nav.append(menuItem);
      }

      div.append(nav);
    }
    this.shadowRoot.append(div);

  }
}


class MenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['text', 'href', 'icon'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', () => {
      const href = this.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  }

  async fetchSvg(icon) {
    const response = await fetch(icon);
    return await response.text();
  }

  async render() {
    const text = this.getAttribute('text') || '';
    const href = this.getAttribute('href') || '#';
    const icon = this.getAttribute('icon') || '';

    let iconSvg = '';
    if (icon) {
      iconSvg = await this.fetchSvg(icon);
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('${menuItemStyleUrl}');
      </style>
      ${icon ? iconSvg : ''}
      <span>${text}</span>
    `;
  }
}

function initMenu() {
  let menu = document.querySelector('json-menu');
  if (!menu) {
    console.log('auto adding menu');
    menu = document.createElement('json-menu');
    menu.setAttribute('href', '/menu.json');
    document.body.prepend(menu); 
  }

}


customElements.define('json-menu', JsonMenu);
customElements.define('menu-item', MenuItem);

// auto inject the menu on page load
window.addEventListener('DOMContentLoaded', initMenu);

