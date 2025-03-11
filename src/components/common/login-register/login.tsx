'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Link } from '@heroui/react'
import { FetchPost } from '@/utils/fetch'
import { loginSchema } from '@/validations/auth'
import { useUserStore } from '@/store/userStore'
import { ErrorHandler } from '@/utils/errorHandler'
import { useRouter } from 'next-nprogress-bar'
import toast from 'react-hot-toast'
import { TextDivider } from './text-divider'
import type { UserState } from '@/store/userStore'

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const { setUser } = useUserStore((state) => state)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { control, watch, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      password: ''
    }
  })

  const handleLogin = async () => {
    setLoading(true)
    const res = await FetchPost<UserState>('/auth/login', {
      ...watch()
    })
    setLoading(false)

    ErrorHandler(res, (value) => {
      setUser(value)
      reset()
      toast.success('登录成功!')
      router.push(`/user/${value.uid}/resource`)
    })
  }

  return (
    <form className="w-72">
      <Controller
        name="name"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="用户名或邮箱"
            type="text"
            variant="bordered"
            autoComplete="username"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            className="mb-4"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="密码"
            type="password"
            variant="bordered"
            isInvalid={!!errors.password}
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            className="mb-4"
          />
        )}
      />
      <Button
        color="primary"
        className="w-full"
        isDisabled={loading}
        isLoading={loading}
        onPress={handleLogin}
      >
        登录
      </Button>

      <TextDivider text="或" />

      <Button
        color="primary"
        variant="bordered"
        className="w-full mb-4"
        onPress={() => router.push('/auth/forgot')}
      >
        忘记密码
      </Button>

      <div className="flex items-center">
        <span className="mr-2">没有账号?</span>
        <Link href="register">注册账号</Link>
      </div>
    </form>
  )
}
