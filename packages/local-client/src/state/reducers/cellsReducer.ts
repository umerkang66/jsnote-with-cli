import produce from 'immer';
import { ActionType } from '../action-types';
import { Actions } from '../actions';
import { CellInterface } from '../CellInterface';

interface CellsState {
  loading: boolean;
  error: string | null;
  // Array of ids
  order: string[];
  data: {
    // It will be an object, with keys will be ids of individual cells, and as values the Cell itself
    [key: string]: CellInterface;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce(
  (state: CellsState = initialState, action: Actions): CellsState => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;

      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;

      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map(cell => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);

        return state;

      case ActionType.FETCH_CELLS_ERROR:
        state.loading = true;
        state.error = action.payload;
        return state;

      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;

      case ActionType.DELETE_CELL:
        // Delete in state.data obj
        delete state.data[action.payload];
        // Delete in state.order array
        state.order = state.order.filter(cellId => cellId !== action.payload);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        // Find the index of cell in state.order that we want to move
        const index = state.order.findIndex(id => id === action.payload.id);
        // New index of the cell that needs to move
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        // Check if target index is not outside the bounds of the state.order array
        if (targetIndex < 0 || targetIndex > state.order.length - 1)
          return state;
        // Do swapping logic
        // Temp is current cell that we are swapping
        const temp = state.order[index];
        // Cell that is present on target index, move that to the position of current cell
        state.order[index] = state.order[targetIndex];
        // Target index is where the cell that needs to move should be placed, we have stored the reference to that in "temp"
        state.order[targetIndex] = temp;
        return state;

      case ActionType.INSERT_CELL_AFTER:
        // Create new cell
        const cell: CellInterface = {
          content: '',
          id: randomId(),
          type: action.payload.type,
        };
        // Add in state.data
        state.data[cell.id] = cell;
        // Add in order array

        // Before this action.payload.id is where the new cell should be inserted, if it is null add the new cell at the end of array
        const foundIndex = state.order.findIndex(
          id => id === action.payload.id
        );

        // If found index is -1, add the new cell at the end of array
        if (foundIndex === -1) {
          state.order.unshift(cell.id);
        } else {
          // Add before id that is provided in action.payload
          state.order.splice(foundIndex + 1, 0, cell.id);
        }
        return state;

      default:
        return state;
    }
  }
);

function randomId(): string {
  // base 36 means all the numbers from zero to 9, and all the letters from a to z
  return Math.random().toString(36).substring(2, 5);
}

export default cellsReducer;
