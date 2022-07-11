import '../styles/cell-list-item.css';
import { FC, Fragment } from 'react';
import { CellInterface } from '../state';

// Components
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

interface CellListItemProps {
    cell: CellInterface;
}

const CellListItem: FC<CellListItemProps> = ({ cell }) => {
    let child: JSX.Element;
    if (cell.type === 'code') {
        child = (
            <Fragment>
                <div className="action-bar-wrapper">
                    <ActionBar id={cell.id} />
                </div>
                <CodeCell cell={cell} />
            </Fragment>
        );
    } else {
        child = (
            <Fragment>
                <ActionBar id={cell.id} />
                <TextEditor cell={cell} />
            </Fragment>
        );
    }

    return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
