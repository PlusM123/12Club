'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addToast, Button, Input, Link } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'
import { FetchPost } from '@/utils/fetch'
import { forgotRequestSchema, forgotResetSchema } from '@/validations/auth'
import { useUserStore } from '@/store/userStore'
import { ErrorHandler } from '@/utils/errorHandler'
import { useRouter } from 'next-nprogress-bar'
import type { UserState } from '@/store/userStore'

type ForgotRequestData = z.infer<typeof forgotRequestSchema>
type ForgotResetData = z.infer<typeof forgotResetSchema>

export const ForgotForm = () => {
  const { setUser } = useUserStore((state) => state)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hasResetCode, setHasResetCode] = useState(false)

  const [isVisible, setIsVisible] = useState(true)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const requestForm = useForm<ForgotRequestData>({
    resolver: zodResolver(forgotRequestSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  const resetForm = useForm<ForgotResetData>({
    resolver: zodResolver(forgotResetSchema),
    defaultValues: {
      name: '',
      email: '',
      resetCode: '',
      password: ''
    }
  })

  const handleForgot = async () => {
    setLoading(true)

    try {
      const formData = hasResetCode ? resetForm.getValues() : requestForm.getValues()
      const res = await FetchPost<UserState>(hasResetCode ? '/auth/reset' : '/auth/forgot', formData)

      ErrorHandler(res, (value) => {
        setUser(value)
        if (hasResetCode) {
          resetForm.reset()
          router.push('/login')
        } else {
          // 切换到重置表单时，将用户名和邮箱复制过去
          resetForm.setValue('name', formData.name)
          resetForm.setValue('email', formData.email)
          setHasResetCode(true)
        }
        addToast({
          title: '成功',
          description: hasResetCode ? '修改密码成功!' : '已发送重置密码请求!',
          color: 'success'
        })
      })
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="w-72">
      {/* 用户名输入框 - 始终显示 */}
      <Controller
        name="name"
        control={hasResetCode ? resetForm.control as any : requestForm.control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="用户名"
            type="name"
            variant="bordered"
            autoComplete="username"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            className="mb-4"
          />
        )}
      />

      {/* 邮箱输入框 - 始终显示 */}
      <Controller
        name="email"
        control={hasResetCode ? resetForm.control as any : requestForm.control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="邮箱"
            type="email"
            variant="bordered"
            isInvalid={!!errors.email}
            autoComplete="email"
            errorMessage={errors.email?.message as string}
            className="mb-4"
          />
        )}
      />

      {/* 重置码和新密码输入框 - 仅在hasResetCode为true时显示 */}
      {hasResetCode && (
        <>
          <Controller
            name="resetCode"
            control={resetForm.control}
            render={({ field, formState: { errors } }) => (
              <Input
                {...field}
                isRequired
                label="重置码"
                type="text"
                variant="bordered"
                isInvalid={!!errors.resetCode}
                errorMessage={errors.resetCode?.message}
                className="mb-4"
              />
            )}
          />
          <Controller
            name="password"
            control={resetForm.control}
            render={({ field, formState: { errors } }) => (
              <Input
                {...field}
                isRequired
                label="新密码"
                type={isVisible ? 'text' : 'password'}
                variant="bordered"
                isInvalid={!!errors.password}
                autoComplete="new-password"
                errorMessage={errors.password?.message}
                className="mb-4"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            )}
          />
        </>
      )}
      <Button
        color="primary"
        className="w-full"
        isDisabled={loading}
        isLoading={loading}
        onPress={handleForgot}
      >
        {hasResetCode ? '修改密码' : '申请重置密码'}
      </Button>

      {
        !hasResetCode && (
          <div className="flex items-center mt-4">
            <span className="mr-2">已有重置码?</span>
            <span
              className="text-primary cursor-pointer"
              onClick={() => {
                // 获取当前表单的值并设置到重置表单中
                const currentValues = requestForm.getValues()
                resetForm.setValue('name', currentValues.name)
                resetForm.setValue('email', currentValues.email)
                setHasResetCode(true)
              }}
            >
              修改密码
            </span>
          </div>
        )
      }
    </form>
  )
}
