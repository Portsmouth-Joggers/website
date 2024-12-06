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
      const sectionElement = document.createElement('nav');
      const titleElement = document.createElement('h2');
      titleElement.textContent = section.title;
      sectionElement.appendChild(titleElement);

      for (const item of section.items) {
        const menuItem = document.createElement('menu-item');
        menuItem.setAttribute('text', item.text);
        menuItem.setAttribute('href', item.href);
        if (item.icon) {
          menuItem.setAttribute('icon', item.icon);
        }
        sectionElement.appendChild(menuItem);
      }

      this.shadowRoot.appendChild(sectionElement);
    }
  }
}

customElements.define('json-menu', JsonMenu);