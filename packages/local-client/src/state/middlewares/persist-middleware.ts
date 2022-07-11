import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Actions } from '../actions';
import { saveCells } from '../action-creators';
import { RootState } from '../reducers';

type Store = {
  dispatch: Dispatch<Actions>;
  getState(): RootState;
};

// First function receives an obj like store, that has dispatch property
export const persistMiddleware = ({ dispatch, getState }: Store) => {
  let timer: NodeJS.Timeout;

  // Second function receive next function
  return (next: (action: Actions) => void) => {
    // Third function receives action obj
    return (action: Actions) => {
      // We are not stop or modifying any action
      next(action);

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          // if we end up calling this timer again within those 250 milliseconds, then clear the timer
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // only save if these actions are called
          // we don't have to call dispatch, because save is wired up for thunk, that automatically call dispatch,
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};
