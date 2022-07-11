import { Dispatch } from 'redux';
import axios from 'axios';
import { ActionType } from '../action-types';
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  BundleStartAction,
  BundleCompleteAction,
  Direction,
  Actions,
} from '../actions';
import { CellInterface, CellTypes } from '../CellInterface';

// BUNDLER
import bundler from '../../bundler';
import { RootState } from '../reducers';

// ACTION_CREATORS
export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return { type: ActionType.DELETE_CELL, payload: id };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      // To which cell it should be inserted before
      id,
      // What type of cell should be inserted, 'code' or 'text'
      type,
    },
  };
};

export const bundleCode = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Actions>) => {
    // Dispatch the start bundle action creator
    // Provide generic type was not necessary because we already provide it in Dispatch<>
    dispatch<BundleStartAction>({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundler(input);

    // Dispatch the complete bundle action creator
    // Provide generic type was not necessary because we already provide it in Dispatch<>
    dispatch<BundleCompleteAction>({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: {
          code: result.code,
          err: result.err,
        },
      },
    });
  };
};

export const fetchCells = () => async (dispatch: Dispatch<Actions>) => {
  // flip the loading flag to true in reducer
  dispatch({ type: ActionType.FETCH_CELLS });

  try {
    const { data }: { data: CellInterface[] } = await axios.get('/cells');

    dispatch({
      type: ActionType.FETCH_CELLS_COMPLETE,
      payload: data,
    });
  } catch (err: any) {
    dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message });
  }
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => RootState) => {
    const {
      cells: { data, order },
    } = getState();
    const cells = order.map(id => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (err: any) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};
