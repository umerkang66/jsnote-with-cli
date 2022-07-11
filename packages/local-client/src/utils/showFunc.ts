export const showFunc = (): string => {
  return `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) => {
      const _root = document.querySelector('#root');

      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          // JSX ELEMENT
          _ReactDOM.render(value, _root);
        } else {
          _root.innerHTML = JSON.stringify(value);
        }
      } else { 
        _root.innerHTML = value;
      }
    };
  `;
};

export const showFuncNoop = (): string => 'var show = () => {};';
