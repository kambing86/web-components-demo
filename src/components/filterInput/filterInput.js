import { dispatch } from '../../state.js';

export default class FilterInput extends HTMLElement {
  // private variables
  _container;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // css link
    const cssLink = document.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', './styles.css');
    shadowRoot.appendChild(cssLink);

    // container
    const container = document.createElement('span');
    container.className = 'filter-input';
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

  render = () => {
    this.cleanContainer();
    const container = this._container;

    // text input
    const textInput = document.createElement('input');
    textInput.setAttribute('placeholder', 'Type to Filter...');
    textInput.addEventListener('input', this.inputFilter);
    container.appendChild(textInput);
  };

  inputFilter = (event) => {
    const filterText = event.currentTarget.value;
    dispatch({ type: 'filter', payload: filterText });
  };

  // lifecycle methods
  connectedCallback() {
    this.render();
  }
}

customElements.define('filter-input', FilterInput);
