import { connect } from '../../state.js';
import { getNameFromData } from '../../helper.js';

function createShoppingItem(itemData) {
  const shoppingItem = document.createElement('shopping-item');
  shoppingItem.data = itemData;
  shoppingItem.className = 'item';
  return shoppingItem;
}

export default class ShoppingView extends HTMLElement {
  // private variables
  _container;
  _dataAry;
  _cleanup;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // css link
    const cssLink = document.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', './styles.css');
    shadowRoot.appendChild(cssLink);

    // outer container
    const outerContainer = document.createElement('div');
    outerContainer.className = 'shopping-view flex-center';
    shadowRoot.appendChild(outerContainer);

    // container
    const container = document.createElement('div');
    container.className = 'container flex-center';
    this._container = container;
    outerContainer.appendChild(container);

    // add loading spinner
    const loadingImg = document.createElement('img');
    loadingImg.setAttribute('src', './assets/spinner.svg');
    loadingImg.className = 'spinner';
    container.appendChild(loadingImg);
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
    const { filterText } = state;
    const filteredData = this._dataAry.filter((itemData) => {
      const textLowerCase = filterText.toLowerCase();
      return (
        textLowerCase.length <= 2 ||
        getNameFromData(itemData).toLowerCase().includes(textLowerCase)
      );
    });
    return {
      filteredData,
    };
  };

  render = ({ filteredData }) => {
    this.cleanContainer();
    const shoppingItems = filteredData.map((itemData) =>
      createShoppingItem(itemData),
    );
    shoppingItems.forEach((item) => {
      this._container.appendChild(item);
    });

    if (shoppingItems.length === 0) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'not-found flex-center';
      this._container.appendChild(messageDiv);
    } else {
      // fill for layout
      const remaining = 3 - (shoppingItems.length % 3);
      for (let i = 0; i < remaining; i++) {
        const filler = document.createElement('div');
        filler.className = 'item';
        this._container.appendChild(filler);
      }
    }
  };

  fetchData = () => {
    fetch('./mocks/listHero.json')
      .then((res) => res.json())
      .then((dataAry) => {
        this._dataAry = dataAry;
        this._cleanup = connect(this.mapStateToProps, this.render);
      });
  };

  // lifecycle methods
  connectedCallback() {
    // add timeout to show spinner for 1 sec
    setTimeout(this.fetchData, 1000);
  }

  disconnectedCallback() {
    this._cleanup();
  }
}

customElements.define('shopping-view', ShoppingView);
