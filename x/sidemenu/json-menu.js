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
    this.shadowRoot.innerHTML = `
      <style>
        @import url('./json-menu.css');
      </style>
    `;

    for (const section of data) {
      const div = document.createElement('div');
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
      this.shadowRoot.append(div);
    }
  }
}

customElements.define('json-menu', JsonMenu);