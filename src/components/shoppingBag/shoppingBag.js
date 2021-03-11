import { connect } from '../../state.js';

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export default class ShoppingBag extends HTMLElement {
  // private variables
  _container;
  _cleanup;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // css link
    const cssLink = document.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', './styles.css');
    shadowRoot.appendChild(cssLink);

    // container
    const container = document.createElement('div');
    container.className = 'shopping-bag';
    this._container = container;
    shadowRoot.appendChild(container);
  }

  // methods
  cleanContainer = () => {
    const container = this._container;
    if (container === undefined) return;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  mapStateToProps = (state) => {
    return {
      totalPrice: state.cart
        .map((p) => p.price)
        .reduce((acc, cur) => acc + cur, 0),
    };
  };

  render = ({ totalPrice }) => {
    this.cleanContainer();
    const container = this._container;

    // price
    const price = document.createElement('span');
    price.textContent = currencyFormatter.format(totalPrice);
    container.appendChild(price);

    // icon
    const icon = document.createElement('img');
    icon.setAttribute('src', './assets/shoppingBag.png');
    container.appendChild(icon);
  };

  // lifecycle methods
  connectedCallback() {
    this._cleanup = connect(this.mapStateToProps, this.render);
  }

  disconnectedCallback() {
    this._cleanup();
  }
}

customElements.define('shopping-bag', ShoppingBag);
