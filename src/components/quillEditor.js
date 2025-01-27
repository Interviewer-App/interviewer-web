'use client'
import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css'; 
import Quill from 'quill'; 

const QuillEditor = ({value ,placeholder,onChange, editorId }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
    const quill = new Quill(`#${editorId}`, {
      theme: 'snow',
      placeholder: placeholder || 'Write something...',
    });

    quillRef.current = quill;

    if (value) {
      quill.setContents(quill.clipboard.convert(value));
    }

    quill.on('text-change', () => {
      const content = quill.root.innerHTML;
      onChange(content);
    });

    quill.on('text-change', () => {
      const content = quill.root.innerHTML; 
      onChange(content); 
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
  }
    }, [editorId]);

      useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const quill = quillRef.current;
      // quillRef.current.root.innerHTML = value;
      const currentContent = quill.root.innerHTML;
      if (!currentContent.includes(value)) {
        quill.clipboard.dangerouslyPasteHTML(currentContent + value);
      }
    }
  }, [value]);

  return (
    <div>
      <div id={editorId} style={{ minHeight: '100px'}} className='quill-editor'>
      </div>
    </div>
  );
};

export default QuillEditor;
