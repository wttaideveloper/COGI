import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({ extensions: [StarterKit], content: value || '<p></p>', onUpdate: ({ editor }) => onChange(editor.getHTML()) })
  useEffect(() => { if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '<p></p>') }, [editor, value])
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
