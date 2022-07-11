export const startingInput = [
  {
    content:
      '# JsNote\n\nThis is an interactive coding environment. You can write javascript, see it executed, and write comprehensive documentation using markdown.\n\n- Click any text cell, including this one to edit the cell.\n- The code in each editor is all joined together in one file, if you have define a variable in cell #1, you can refer to it in any following cell.\n- You can show any react component, string, number or anything else by calling the ```show()``` function. This function is build into this environment. Call show multiple times to show multiple values.\n- Reorder or delete cells using the buttons on the top right.\n- Add new cells by hovering on the top of divider between each cell.\n\nAll of the changes get saved to the file you have opened JsNote with. So if you ran ```jsnote-umer serve test.js```, all of the text and code you write will be saved to ```test.json``` file.',
    id: 'r4g',
    type: 'text',
  },
  {
    content:
      "import { useState } from 'react';\n\nconst Counter = () => {\n  const [counter, setCounter] = useState(0);\n  const incrementCounter = () => {\n    setCounter(counter + 1);\n  };\n  return (\n    <div>\n      <h1>Counter: {counter}</h1>\n      <button onClick={incrementCounter}>Increment</button>\n    </div>\n  );\n};\n\nshow(<Counter />);",
    id: 'pbp',
    type: 'code',
  },
  {
    content:
      'const SecondCounter = () => {\n  return (\n    <div>\n      <h3>Components from previous cells</h3>\n      <Counter />\n    </div>\n  );\n};\n\nshow(<SecondCounter />);',
    id: '81z',
    type: 'code',
  },
];
