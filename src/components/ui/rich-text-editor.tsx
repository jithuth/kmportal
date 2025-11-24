"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Dynamically import ReactQuill to avoid SSR issues
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <div className="min-h-[400px] border border-gray-300 rounded-lg animate-pulse bg-gray-50" />
    }), [])

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    }

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'bullet', 'indent',
        'align',
        'blockquote', 'code-block',
        'link', 'image', 'video'
    ]

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || "Write your content here..."}
                className="bg-white"
            />
            <style jsx global>{`
                .rich-text-editor .quill {
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                
                .rich-text-editor .ql-toolbar {
                    background: #f9fafb;
                    border: none;
                    border-bottom: 1px solid #d1d5db;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                
                .rich-text-editor .ql-container {
                    border: none;
                    font-size: 14px;
                    min-height: 400px;
                }
                
                .rich-text-editor .ql-editor {
                    min-height: 400px;
                    padding: 1rem;
                }
                
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                
                .rich-text-editor .ql-snow .ql-stroke {
                    stroke: #4b5563;
                }
                
                .rich-text-editor .ql-snow .ql-fill {
                    fill: #4b5563;
                }
                
                .rich-text-editor .ql-snow .ql-picker-label {
                    color: #4b5563;
                }
                
                .rich-text-editor .ql-toolbar button:hover,
                .rich-text-editor .ql-toolbar button:focus,
                .rich-text-editor .ql-toolbar button.ql-active {
                    color: #059669;
                }
                
                .rich-text-editor .ql-toolbar button:hover .ql-stroke,
                .rich-text-editor .ql-toolbar button:focus .ql-stroke,
                .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #059669;
                }
                
                .rich-text-editor .ql-toolbar button:hover .ql-fill,
                .rich-text-editor .ql-toolbar button:focus .ql-fill,
                .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
                    fill: #059669;
                }
                
                .rich-text-editor .ql-snow.ql-toolbar button:hover,
                .rich-text-editor .ql-snow .ql-toolbar button:hover,
                .rich-text-editor .ql-snow.ql-toolbar button:focus,
                .rich-text-editor .ql-snow .ql-toolbar button:focus,
                .rich-text-editor .ql-snow.ql-toolbar button.ql-active,
                .rich-text-editor .ql-snow .ql-toolbar button.ql-active {
                    background: #d1fae5;
                }
            `}</style>
        </div>
    )
}
