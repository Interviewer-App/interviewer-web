import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import EditorToolbar from "./toolbar/editor-toolbar"

const Editor = ({ content, placeholder, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  if (!editor) return <></>

  return (
    <div className="prose max-w-none w-full border-input bg-[#32353b] dark:prose-invert rounded-lg focus:outline-none">
      <EditorToolbar editor={editor}/>
      <div className="editor px-5 h-[200px] overflow-auto focus:outline-none">
        <EditorContent editor={editor} placeholder={placeholder} className=" max-w-[700px] h-full focus:outline-none" />
      </div>
    </div>
  )
}

export default Editor
