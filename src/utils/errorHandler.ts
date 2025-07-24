import { addToast } from '@heroui/react'

export const ErrorHandler = <T>(
  res: T | string,
  callback: (res: T) => void
) => {
  if (typeof res === 'string') {
    try {
      const parsedRes = JSON.parse(res)

      if (Array.isArray(parsedRes)) {
        const errorMessages = parsedRes
          .map((err) =>
            typeof err.message === 'string' ? err.message : '发生未知错误'
          )
          .join('\n')
        addToast({
          title: '错误',
          description: errorMessages,
          color: 'danger'
        })
      } else if (typeof parsedRes === 'object' && parsedRes.message) {
        addToast({
          title: '错误',
          description: parsedRes.message,
          color: 'danger'
        })
      } else {
        addToast({
          title: '错误',
          description: '发生未知错误',
          color: 'danger'
        })
      }
    } catch (e) {
      addToast({
        title: '错误',
        description: res,
        color: 'danger'
      })
    }
  } else {
    callback(res)
  }
}
