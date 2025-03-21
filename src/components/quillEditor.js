'use client'
import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';

const QuillEditor = ({ value, placeholder, onChange, editorId, jobDescription }) => {
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
        color: #ffffff !important;
        font-family: 'Arial', sans-serif !important;
        font-size: 15px !important;
        font-weight: normal !important;
        font-style: normal !important;
      }
      .ql-container {
        border-color: #27282c !important;

      }
      .ql-editor {
        outline: none !important;
      }
      `;
      document.head.appendChild(style);
    }
  }, [editorId]);

  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const quill = quillRef.current;

      const currentContent = quill.root.innerHTML;
      if (!currentContent.includes(value)) {
        quill.clipboard.dangerouslyPasteHTML(currentContent + value);
      }
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current && jobDescription) {
      const quill = quillRef.current;
      
      // Clear existing content first
      quill.setContents([]);
      
      // Insert new job description at the beginning
      quill.clipboard.dangerouslyPasteHTML(0, jobDescription);
      
      // Trigger the onChange handler
      onChange(jobDescription);
    }
  }, [jobDescription]);

  return (
    <div className=' bg-[#32353b] rounded-lg'>
      <div id={editorId} style={{ minHeight: '100px' }} className='quill-editor max-h-[150px] overflow-y-auto'>
      </div>
    </div>
  );
};

export default QuillEditor;
