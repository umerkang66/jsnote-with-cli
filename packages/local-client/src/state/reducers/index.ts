import { combineReducers } from 'redux';

// Reducers
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export type RootState = ReturnType<typeof reducers>;
export default reducers;
