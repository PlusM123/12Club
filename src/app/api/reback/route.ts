import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '../../../../prisma'
import { getRouteByDbId } from '@/utils/router'

interface ResultComment {
    ip_address: string
    nickname: string
    content: string
    created_at: string
    updated_at: string
}

interface ResultData {
    originalTitle: string
    id: number
    images: string
    dbId: string
    download: string
    view: string
    name: string
    translator: string
    author: string
    introduction: string
    alias: string[]
    tag: string[]
    accordionTotal: string
    released: string
    comments: ResultComment[]
    created?: string
    updated?: string
}

// 安全地将字符串转换为日期，如果无效则返回当前时间
function parseDate(dateString: string | undefined): Date {
    if (!dateString) {
        return new Date()
    }
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? new Date() : date
}

export async function GET(req: NextRequest) {
    try {
        // 读取 results.json 文件
        const filePath = join(process.cwd(), 'public', 'results.json')
        const fileContent = await readFile(filePath, 'utf-8')
        const results: ResultData[] = JSON.parse(fileContent)

        // 查找用户名为 "前人遗论" 的用户
        const commentUser = await prisma.user.findFirst({
            where: { name: '前人遗论' },
            select: { id: true }
        })

        if (!commentUser) {
            return NextResponse.json(
                { error: '未找到用户 "前人遗论"' },
                { status: 404 }
            )
        }

        let successCount = 0
        let skipCount = 0
        let errorCount = 0
        const errors: string[] = []

        // 处理每个资源
        for (const result of results) {
            try {
                // 检查资源是否已存在
                const existingResource = await prisma.resource.findFirst({
                    where: { db_id: result.dbId },
                    select: { id: true, db_id: true, aliases: true }
                })

                if (existingResource) {
                    if (existingResource.aliases) {
                        await prisma.resourceAlias.deleteMany({
                            where: { resource_id: existingResource.id }
                          })

                        const addAliases = [...result.alias, '老站资源名：' + result.originalTitle]
                        const aliasData = addAliases.map((name) => ({
                            name,
                            resource_id: existingResource.id
                        }))
    
                        await prisma.resourceAlias.createMany({
                            data: aliasData
                        })
                    }
                } else {
                    skipCount++
                    continue
                }

                successCount++
                console.log(`成功处理资源: ${result.dbId} - ${result.name}`)
            } catch (error) {
                errorCount++
                const errorMsg = `处理资源 ${result.dbId} 失败: ${error instanceof Error ? error.message : '未知错误'}`
                errors.push(errorMsg)
                console.error(errorMsg)
            }
        }

        return NextResponse.json({
            success: true,
            message: '资源导入完成',
            stats: {
                total: results.length,
                success: successCount,
                skipped: skipCount,
                error: errorCount
            },
            errors: errors.length > 0 ? errors : undefined
        })
    } catch (error) {
        console.error('导入资源失败:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '导入资源时发生未知错误'
            },
            { status: 500 }
        )
    }
}
