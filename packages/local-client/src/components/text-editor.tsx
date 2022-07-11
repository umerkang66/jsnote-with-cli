import '../styles/text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { FC, useEffect, useRef, useState } from 'react';
// State
import { CellInterface } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: CellInterface;
}

const TextEditor: FC<TextEditorProps> = ({ cell }) => {
  const MDEditorDivRef = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        MDEditorDivRef.current &&
        e.target &&
        MDEditorDivRef.current.contains(e.target as Node)
      ) {
        // Element that is clicked on is inside the editor
        return;
      }
      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={MDEditorDivRef}>
        <MDEditor
          value={cell.content}
          onChange={v => updateCell(cell.id, v || '')}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || '# Click to Edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
