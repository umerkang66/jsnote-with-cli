// Hooks
import { useTypedSelector } from './use-typed-selector';

// Utils
import { showFunc, showFuncNoop } from '../utils/showFunc';

export const useCumulativeCode = (currentCellId: string): string => {
  const cumulativeCode = useTypedSelector(state => {
    const { data, order } = state.cells;
    const orderedCells = order.map(cellId => data[cellId]);

    const cumulativeCodeArr = [];

    for (const c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === currentCellId) {
          // If current cell is equal to looped cell, then add the real showFunc
          cumulativeCodeArr.push(showFunc());
        } else {
          // otherwise add the show func that does nothing
          cumulativeCodeArr.push(showFuncNoop());
        }
        cumulativeCodeArr.push(c.content);
      }
      // Only bundle the code to this cell, when the looped cell is equal to current cell. Break the loop
      if (c.id === currentCellId) break;
    }
    return cumulativeCodeArr;
  });

  // Bundle the cumulative code (joining that code by new line)
  return cumulativeCode.join('\n');
};
