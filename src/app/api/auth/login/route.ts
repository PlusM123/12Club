import { z } from 'zod'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { ParsePostBody } from '@/utils/parse-query'
import { loginSchema } from '@/validations/auth'
import { verifyPassword } from '@/utils/algorithm'
import type { UserState } from '@/store/userStore'
import { createClient } from '@/supabase'
import { generateToken } from '@/utils/jwt'

export const login = async (input: z.infer<typeof loginSchema>) => {
  const supabase = await createClient()
  const { name, password } = input

  const { data: user } = await supabase
    .from('user')
    .select('*')
    .or('email.eq.' + name + ',name.eq.' + name)
    .single()

  if (!user) {
    return '用户未找到'
  }
  if (user.status === 2) {
    return '该用户已被封禁, 如果您觉得有任何问题, 请联系我们'
  }

  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) {
    return '用户密码错误'
  }

  const { error: updateError } = await supabase
    .from('user')
    .update({
      last_login_time: new Date().toISOString()
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('Update last login time error:', updateError)
  }

  const token = await generateToken(user.id, user.name, user.role, '30d')
  const cookie = await cookies()
  cookie.set('moe-token', token, {
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
  const input = await ParsePostBody(req, loginSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const response = await login(input)
  return NextResponse.json(response)
}
