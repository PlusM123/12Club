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
}
