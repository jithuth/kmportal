export function stripHtml(html: string): string {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '')
}

export function truncateText(text: string, length: number): string {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}
