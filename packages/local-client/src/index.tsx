import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Components
import CellList from './components/cell-list';
// State
import { store } from './state';

const App = () => {
  return (
    <div>
      <CellList />
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// lerna init
// lerna add typescript --dev --scope=local-api
// lerna add commander --scope=cli
// lerna add local-api --scope=cli
// Execute the start scripts in each different packages
// lerna run start  --parallel
// lerna bootstrap
// lerna publish --no-push
