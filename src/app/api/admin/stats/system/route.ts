import { NextRequest, NextResponse } from 'next/server'
import * as si from 'systeminformation'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import type { SystemInfo } from '@/types/api/admin'

export const getSystemInfo = async (): Promise<SystemInfo> => {
  try {
    const [cpuLoad, cpuInfo, memData, diskData, osData, timeData] = await Promise.all([
      si.currentLoad(),
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.osInfo(),
      si.time()
    ])

    // 计算所有硬盘的累计信息
    const totalDisk = diskData.reduce(
      (acc, disk) => ({
        size: acc.size + disk.size,
        used: acc.used + disk.used,
        available: acc.available + disk.available
      }),
      { size: 0, used: 0, available: 0 }
    )

    // 处理各个分区的详细信息
    const diskPartitions = diskData.map(disk => ({
      fs: disk.fs || 'Unknown',
      type: disk.type || 'Unknown',
      size: disk.size,
      used: disk.used,
      available: disk.available,
      usagePercent: disk.size > 0 ? Math.round((disk.used / disk.size) * 100) : 0,
      mount: disk.mount || '/'
    }))
    
    return {
      cpu: {
        usage: Math.round(cpuLoad.currentLoad),
        model: cpuInfo.brand || 'Unknown',
        cores: cpuInfo.cores || 0
      },
      memory: {
        total: memData.total,
        used: memData.used,
        free: memData.free,
        usagePercent: Math.round((memData.used / memData.total) * 100)
      },
      disk: {
        total: totalDisk.size,
        used: totalDisk.used,
        free: totalDisk.available,
        usagePercent: totalDisk.size > 0 ? Math.round((totalDisk.used / totalDisk.size) * 100) : 0
      },
      diskPartitions,
      uptime: timeData.uptime,
      platform: osData.platform,
      distro: osData.distro,
      release: osData.release
    }
  } catch (error) {
    console.error('获取系统信息失败:', error)
    // 返回默认值
    return {
      cpu: { usage: 0, model: 'Unknown', cores: 0 },
      memory: { total: 0, used: 0, free: 0, usagePercent: 0 },
      disk: { total: 0, used: 0, free: 0, usagePercent: 0 },
      diskPartitions: [],
      uptime: 0,
      platform: 'Unknown',
      distro: 'Unknown',
      release: 'Unknown'
    }
  }
}

export const GET = async (req: NextRequest) => {
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录', { status: 401 })
  }
  if (payload.role < 3) {
    return NextResponse.json('本页面仅管理员可访问', { status: 403 })
  }

  try {
    const data = await getSystemInfo()
    return NextResponse.json(data)
  } catch (error) {
    console.error('系统信息API错误:', error)
    return NextResponse.json('获取系统信息失败', { status: 500 })
  }
} 