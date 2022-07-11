import '../styles/cell-list.css';
import { FC, Fragment, useEffect } from 'react';
// Actions
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useActions } from '../hooks/use-actions';
// Components
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

const CellList: FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    // Get cells according the cellsState.order
    return order.map(id => data[id]);
  });
  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map(cell => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
