"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
    Bold, Italic, Strikethrough, Code, List, ListOrdered,
    Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react'
import { useCallback } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    return (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Strike"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Justify"
            >
                <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 text-gray-600"
                title="Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    )
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder: placeholder || 'Write your content here...',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    })

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
