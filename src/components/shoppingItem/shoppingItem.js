import { connect, dispatch, getState } from '../../state.js';
import { getNameFromData } from '../../helper.js';

function getProductPayload(data) {
  const id = getNameFromData(data);
  // assuming all the price currency is the same
  const price = Number(data.price.amount);
  return { id, price };
}

function isProductExists(state, id) {
  return state.cart.find((p) => p.id === id) !== undefined;
}

export default class ShoppingItem extends HTMLElement {
  // private variables
  _container;
  _data;
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
    container.classList = 'shopping-item flex-center';
    this._container = container;

    shadowRoot.appendChild(container);
  }

  get data() {
    return this._data;
  }

  set data(val) {
    this._data = val;
  }

  // methods
  cleanContainer = () => {
    const container = this._container;
    if (container === undefined) return;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  onClick = () => {
    // change state
    const id = getNameFromData(this._data);
    const action = isProductExists(getState(), id)
      ? { type: 'remove', payload: id }
      : { type: 'add', payload: getProductPayload(this._data) };
    dispatch(action);
  };

  mapStateToProps = (state) => {
    const id = getNameFromData(this._data);
    return {
      productExists: isProductExists(state, id),
    };
  };

  render = ({ productExists }) => {
    this.cleanContainer();
    const container = this._container;

    if (this._data === undefined) return;
    const { price, imagePath } = this._data;
    const id = getNameFromData(this._data);

    // name
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = id;
    container.appendChild(nameDiv);

    // image
    const imageDiv = document.createElement('img');
    imageDiv.setAttribute('src', imagePath);
    imageDiv.setAttribute('draggable', false);
    container.appendChild(imageDiv);

    // price
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    const currencyFormatter = new Intl.NumberFormat(price.locale, {
      style: 'currency',
      currency: price.currency,
    });
    priceDiv.textContent = currencyFormatter.format(price.amount);
    if (productExists) {
      priceDiv.classList.add('added');
    }
    container.appendChild(priceDiv);

    // action
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action';
    if (productExists) {
      actionDiv.classList.add('added');
    }
    container.appendChild(actionDiv);

    container.setAttribute('role', 'button');
    container.addEventListener('click', this.onClick);
  };

  // lifecycle methods
  connectedCallback() {
    this._cleanup = connect(this.mapStateToProps, this.render);
  }

  disconnectedCallback() {
    this._cleanup();
  }
}

customElements.define('shopping-item', ShoppingItem);
