"use client"

interface ArticleContentProps {
    content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
    return (
        <>
            <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
            <style jsx global>{`
                .rich-content {
                    line-height: 1.8;
                }
                .rich-content h1 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #111827;
                }
                .rich-content h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-top: 1.75rem;
                    margin-bottom: 0.875rem;
                    color: #111827;
                }
                .rich-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #111827;
                }
                .rich-content p {
                    margin-bottom: 1rem;
                    color: #374151;
                }
                .rich-content ul, .rich-content ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }
                .rich-content li {
                    margin-bottom: 0.5rem;
                }
                .rich-content a {
                    color: #059669;
                    text-decoration: underline;
                }
                .rich-content a:hover {
                    color: #047857;
                }
                .rich-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1.5rem 0;
                }
                .rich-content blockquote {
                    border-left: 4px solid #059669;
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #6b7280;
                }
                .rich-content code {
                    background: #f3f4f6;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                }
                .rich-content pre {
                    background: #1f2937;
                    color: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                .rich-content pre code {
                    background: transparent;
                    padding: 0;
                    color: inherit;
                }
            `}</style>
        </>
    )
}
