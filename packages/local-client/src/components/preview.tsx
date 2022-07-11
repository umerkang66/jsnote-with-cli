import '../styles/preview.css';
import { FC, useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head>
        <style>html {background-color: white;}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          // HANDLING ASYNCHRONOUS ERRORS
          window.addEventListener('error', (event) => {
            // UNCAUGHT CONSOLE ERRORS WILL NOT SHOW IN THE BROWSER, BUT OUR CONSOLE.LOG WILL SHOW
            event.preventDefault();
            handleError(event.error);
          })

          window.addEventListener('message', (event) => {
            // ALL THE SYNCHRONOUS ERRORS WILL BE HANDLED HERE
            try {
              // RUN THE TRANSPILED CODE IN BROWSER
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: FC<PreviewProps> = ({ code, err }) => {
  const iFrameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Reset the iframe html content
    if (iFrameRef.current) iFrameRef.current.srcdoc = html;

    // By setting this timeout, browser should have time to update the html, then send the postMessage handler request
    setTimeout(() => {
      if (iFrameRef.current && iFrameRef.current.contentWindow) {
        // Send the bundled and transpiled code to iFrame. This is actually emit the message Event on Window, that we have already handled in the srcDoc html script tag

        // This property will be present on event.data
        iFrameRef.current.contentWindow.postMessage(
          code,
          // * means allows all domains
          '*'
        );
      }
    }, 50);

    // Whenever code changes run this useEffect
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iFrameRef}
        title="code-preview"
        srcDoc={html}
        // Get access from parent to child is allowed
        // if sandbox="", it is not allowed
        // sandbox="allow-same-origin", here it is allowed
        sandbox="allow-scripts" // here only scripts that are provided through html (srcDoc) are allows
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
