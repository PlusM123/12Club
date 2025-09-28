'use client'

import { getMemeList } from '@/utils/memeUtils'
import { cn } from '@/lib/utils'

interface CommentContentProps {
    content: string
    className?: string
    isPreview?: boolean
}

export const CommentContent = ({
    content,
    className,
    isPreview = false
}: CommentContentProps) => {
    const memeList = getMemeList()
    const memeMap = new Map(memeList.map(meme => [meme.displayName, meme]))

    // 将文本按照 meme 标记分割并渲染
    const renderContent = () => {
        if (!content) return null

        // 使用正则表达式分割文本，包含 meme 标记
        const parts = content.split(/(\[meme_[^[\]]+\])/)

        return parts.map((part, index) => {
            // 如果是 meme 标记
            if (part.match(/^\[meme_[^[\]]+\]$/)) {
                const meme = memeMap.get(part)
                if (meme) {
                    return (
                        <img
                            key={`${part}-${index}`}
                            src={meme.path}
                            alt={meme.displayName}
                            className={cn(
                                'inline-block mx-1 rounded align-bottom',
                                isPreview ? 'w-10 h-10' : 'w-14 h-14'
                            )}
                            title={meme.displayName}
                            loading="lazy"
                        />
                    )
                }
                // 如果找不到对应的 meme，显示原文本
                return <span key={`${part}-${index}`}>{part}</span>
            }

            // 普通文本，保持换行
            return (
                <span key={`text-${index}`} className="whitespace-pre-wrap">
                    {part}
                </span>
            )
        })
    }

    return (
        <div className={cn('leading-relaxed', className)}>
            {renderContent()}
        </div>
    )
} 