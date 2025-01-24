import { useEffect } from 'react';
import 'quill/dist/quill.snow.css'; // import Quill's CSS
import Quill from 'quill'; // import Quill library

const QuillEditor = ({value,placeholder,onChange }) => {
  useEffect(() => {
    // Initialize the Quill editor when the component mounts
    const quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: placeholder || 'Write something...',
    });
    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on('text-change', () => {
      debugger
      const content = quill.root.innerHTML; // Get content from the editor (HTML format)
      onChange(content); // Call the parent onChange handler to update the state
    });
      const style = document.createElement('style');
      style.innerHTML = `
      .ql-editor.ql-blank::before {
        color: #787777 !important; 
        font-family: 'Arial', sans-serif !important; 
        font-size: 15px !important;
        font-weight: normal !important; 
        font-style: italic !important; 
      }
      `;
      document.head.appendChild(style);
    }, []);

  return (
    <div>
      <div id="editor" style={{ minHeight: '100px'}} className='quill-editor'>
        
      </div>
    </div>
  );
};

export default QuillEditor;
