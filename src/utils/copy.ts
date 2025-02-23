import toast from 'react-hot-toast'

const decodeIfEncoded = (text: string) => {
  try {
    const decoded = decodeURIComponent(text)
    return decoded !== text ? decoded : text
  } catch (e) {
    return text
  }
}

export const Copy = (originText: string) => {
  const text = decodeIfEncoded(originText)

  if (navigator?.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text}`, {
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }
        })
      })
      .catch(() => toast.error('复制失败! 请更换更现代的浏览器!'))
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed' // 避免滚动到页面底部
    textarea.style.opacity = '0' // 隐藏 textarea
    document.body.appendChild(textarea)
    textarea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        toast.success(`${text}`, {
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }
        })
      } else {
        toast.error('复制失败! 请手动复制文本。')
      }
    } catch (err) {
      toast.error('复制失败! 请手动复制文本。')
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
