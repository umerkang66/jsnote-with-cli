// CodeCell component will communicate back and forth between CodeEditor and Preview Window

import '../styles/code-cell.css';
import { FC, useEffect } from 'react';

// Components
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

// State
import { CellInterface } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

// Hooks
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: CellInterface;
}

const CodeCell: FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, bundleCode } = useActions();
  // Get bundle code of the current cell
  const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  // IMPORTANT! use-actions give us slightly different version of actions every time, not the same as we defined in action creators file, when new state is created, this component is re-rendered, hence use-action is called, which gives us a again different version of action, thus action change on every re-render then this useEffect will run infinitely
  // To fix this issue make sure to not provide the slightly different version of bundle code every time
  useEffect(() => {
    // First time bundling (when there is no code) shouldn't wait bundle the code, and immediately return it
    if (!bundle) {
      bundleCode(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(() => {
      bundleCode(cell.id, cumulativeCode);
    }, 1000);

    // This will be called automatically next time when useEffect is called
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleCode, cumulativeCode, cell.id]);

  // I want to make resizable the entire code cell, and only vertical direction
  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={value => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading...
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
