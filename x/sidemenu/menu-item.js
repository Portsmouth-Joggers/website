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
        @import url('./menu-item.css');
      </style>
      ${icon ? iconSvg : ''}
      <span>${text}</span>
    `;
  }
}

customElements.define('menu-item', MenuItem);