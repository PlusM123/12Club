'use client'

import { Moe } from '@/config/moe'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Checkbox, Input, Link } from '@heroui/react'
import { FetchPost } from '@/utils/fetch'
import { registerSchema } from '@/validations/auth'
import { useUserStore } from '@/store/userStore'
import { ErrorHandler } from '@/utils/errorHandler'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'
// import { EmailVerification } from '~/components/kun/verification-code/Code'
import { useRouter } from 'next-nprogress-bar'
import { TextDivider } from './text-divider'
import type { UserState } from '@/store/userStore'

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const { setUser } = useUserStore((state) => state)
  const router = useRouter()
  const [isAgree, setIsAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const { control, watch, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      code: '',
      password: ''
    }
  })

  const handleRegister = async () => {
    if (!isAgree) {
      toast.error('请您勾选同意我们的用户协议')
      return
    }

    setLoading(true)
    const res = await FetchPost<UserState>('/auth/register', watch())

    setLoading(false)

    ErrorHandler(res, (value) => {
      setUser(value)
      reset()
      toast.success('注册成功!')
      redirect(`/user/${value.uid}`)
    })
  }

  return (
    <form className="flex flex-col space-y-4 w-72">
      <Controller
        name="name"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="用户名"
            type="name"
            variant="bordered"
            autoComplete="username"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="邮箱"
            type="email"
            variant="bordered"
            autoComplete="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        )}
      />
      {/* <Controller
        name="code"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            {...field}
            isRequired
            label="验证码"
            type="text"
            variant="bordered"
            isInvalid={!!errors.code}
            errorMessage={errors.code?.message}
            autoComplete="one-time-code"
            endContent={
              <EmailVerification
                username={watch().name}
                email={watch().email}
                type="register"
              />
            }
          />
        )}
      /> */}
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
            autoComplete="current-password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
        )}
      />

      <div>
        <Checkbox isSelected={isAgree} onValueChange={setIsAgree}>
          <span>我同意</span>
        </Checkbox>
        <Link className="ml-1" href="/doc/notice/privacy">
          {Moe.titleShort} 用户协议
        </Link>
      </div>

      <Button
        color="primary"
        className="w-full"
        isLoading={loading}
        onPress={handleRegister}
      >
        注册
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
        <span className="mr-2">已经有账号了?</span>
        <Link href="/login">登录账号</Link>
      </div>
    </form>
  )
}
