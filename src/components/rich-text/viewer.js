import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const Viewer = ({ content, style }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false
  })

  if (!editor) return <></>

  const className =
    style === "prose" ? "prose-mt-0 prose max-w-none dark:prose-invert" : ""

  return (
    <article className={className}>
      <EditorContent editor={editor} readOnly={true} />
    </article>
  )
}

export default Viewer
