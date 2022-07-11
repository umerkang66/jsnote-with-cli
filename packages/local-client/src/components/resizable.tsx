import '../styles/resizable.css';
import { FC, useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
  // In which direction you want to drag
  direction: 'horizontal' | 'vertical';
}

const Resizable: FC<ResizableProps> = ({ direction, children }) => {
  const [defaultWidth, setDefaultWidth] = useState<number>(
    window.innerWidth * 0.55
  );
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

  // children will be the component, that we want to make resizable

  // If the direction is vertical, the default height should 300px, otherwise (in the horizontal direction) the they should expand as they could
  let resizableProps: ResizableBoxProps;

  useEffect(() => {
    let timer: NodeJS.Timer;

    const listener = () => {
      if (timer) {
        // If current timer is running, clear it then run the setTimeout again
        clearTimeout(timer);
      }
      setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.8 < defaultWidth) {
          setDefaultWidth(window.innerWidth * 0.8);
        }
      }, 100);
    };

    window.addEventListener('resize', listener);

    return () => {
      // Clean up the event listener that we just wired up
      window.removeEventListener('resize', listener);
    };
  }, [defaultWidth]);

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      // This height is in horizontal, it should expand as it should possible
      height: Infinity,
      width: defaultWidth,
      // "e" means "east", handled from where user can drag this element
      resizeHandles: ['e'],

      // We don't want vertical constraints, both max, and min
      maxConstraints: [innerWidth * 0.8, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      onResizeStop: (event, data) => {
        // this will be called when user finished resizing
        setDefaultWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      // "s" means "south", handled from where user can drag this element
      resizeHandles: ['s'],
      // Constraints about how much we can resize it horizontal (first property), and vertical (second property)
      // We don't care about horizontal
      // Don't resize after 90 percent of the view port height
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, innerHeight * 0.1],
    };
  }

  // Infinity means take up as much place as possible
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
