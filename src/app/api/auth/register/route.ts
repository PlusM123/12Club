import { z } from 'zod'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { ParsePostBody } from '@/utils/parse-query'
import { backendRegisterSchema } from '@/validations/auth'
import { getRemoteIp } from '@/utils/getRemoteIp'
import type { UserState } from '@/store/userStore'
import { createClient } from '@/supabase'
import { generateToken } from '@/utils/jwt'

export const register = async (
  input: z.infer<typeof backendRegisterSchema>,
  ip: string
) => {
  const supabase = await createClient()
  const { name, email, password } = input

  // 1. 检查用户名是否已存在
  const { count: usernameCount } = await supabase
    .from('user')
    .select('*', { count: 'exact', head: true })
    .eq('name', name)

  if (usernameCount && usernameCount > 0) {
    return '您的用户名已经有人注册了, 请修改'
  }
  // 2. 检查邮箱是否已存在
  const { count: EmailCount } = await supabase
    .from('user')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)

  if (EmailCount && EmailCount > 0) {
    return '您的邮箱已经有人注册了, 请修改'
  }

  const { data: user, error: userError } = await supabase
    .from('user')
    .insert([
      {
        name: name,
        email,
        password,
        ip,
        role: 1,
        status: 0,
        enable_email_notice: true
      }
    ])
    .select()
    .single()

  if (userError) {
    console.error('User creation error:', userError)
    return { error: 'Failed to create user profile' }
  }

  const token = await generateToken(user.id, name, user.role, '30d')
  const cookie = await cookies()
  cookie.set('12club-token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  const responseData: UserState = {
    uid: user.id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    dailyCheckIn: user.daily_check_in,
    dailyImageLimit: user.daily_image_count,
    dailyUploadLimit: user.daily_upload_size,
    enableEmailNotice: user.enable_email_notice
  }
  return responseData
}

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, backendRegisterSchema)
  console.log(input)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  if (
    !req.headers ||
    (!req.headers.get('x-forwarded-for') &&
      !req.headers.get('x-real-ip') &&
      !req.headers.get('CF-Connecting-IP'))
  ) {
    return NextResponse.json('读取请求头失败')
  }

  const ip = getRemoteIp(req.headers)

  const response = await register(input, ip)
  return NextResponse.json(response)
}
