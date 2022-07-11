import '../styles/code-editor.css';
import { FC, useRef } from 'react';
import { editor } from 'monaco-editor';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onEditorDidMount: EditorDidMount = (getEditorValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    // getEditorValue() will return the value on first time, when component is mounted, but we need the value when the text in editor is changes, thats where second argument comes in

    // monacoEditor is the reference to the editor itself
    monacoEditor.onDidChangeModelContent(() => {
      // When something changes in the editor, get the value again
      onChange(getEditorValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    if (!editorRef.current) return;

    // Get current value
    const unformatted = editorRef.current.getModel()?.getValue();

    if (typeof unformatted === 'undefined') return;

    // Format the value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
        arrowParens: 'avoid',
      })
      .replace(/\n$/, '');

    // Set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        theme="dark"
        height="100%"
        language="javascript"
        // This value is just initial value, this is not used after that (in textarea it is also used after that)
        value={initialValue}
        options={{
          // These the options of not react component, but underlying MonacoEditor
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 14,
          fontWeight: '600',
          scrollBeyondLastLine: false,
          fontFamily: 'jetBrains Mono, Consolas',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
