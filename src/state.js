const listOfObservers = [];
let _state = {
  cart: [],
  filterText: '',
};

function reducer(action, state) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'remove': {
      const id = action.payload;
      const cart = state.cart.filter((product) => product.id !== id);
      return { ...state, cart };
    }
    case 'filter':
      return { ...state, filterText: action.payload };
    default:
      return state;
  }
}

export const getState = () => _state;

export const dispatch = (action) => {
  _state = reducer(action, _state);
  listOfObservers.forEach((observer) => {
    observer.run(_state);
  });
};

function shallowEqual(objectA, objectB) {
  if (objectA === objectB) {
    return true;
  }
  if (typeof objectA !== 'object' || objectA === null) {
    return false;
  }
  if (typeof objectB !== 'object' || objectB === null) {
    return false;
  }
  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objectB, key) ||
      !shallowEqual(objectA[key], objectB[key])
    ) {
      return false;
    }
  }
  return true;
}

class Observer {
  constructor(selector, callback) {
    this.selector = selector;
    this.callback = callback;
    this.value = undefined;
  }

  run(state) {
    const newValue = this.selector(state);
    if (!shallowEqual(newValue, this.value)) {
      this.value = newValue;
      this.callback(newValue);
    }
  }
}

export const connect = (selector, callback) => {
  const observer = new Observer(selector, callback);
  observer.run(_state);
  listOfObservers.push(observer);
  return () => {
    const index = listOfObservers.indexOf(observer);
    listOfObservers.splice(index, 1);
  };
};
