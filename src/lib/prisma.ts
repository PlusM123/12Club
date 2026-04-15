import { PrismaClient } from '@prisma/client'

// 声明全局变量类型
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建 Prisma 客户端的函数
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  })
}

// 确保在开发和生产环境都只创建一个实例
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// 开发环境下缓存到全局变量，避免热重载时创建多个连接
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
