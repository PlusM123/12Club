import { NextRequest, NextResponse } from 'next/server'
import type { UserState } from '@/store/userStore'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { createClient } from '@/supabase'

export const getStatus = async (uid: number | undefined) => {
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('user')
    .select('*')
    .eq('id', uid)
    .single()

  if (!user) {
    return '用户未找到'
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

  //   const redirectConfig = await getRedirectConfig()
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
    // ...redirectConfig
  }

  return responseData
}

export async function GET(req: NextRequest) {
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const status = await getStatus(payload?.uid)
  return NextResponse.json(status)
}
