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
                    select: { id: true, db_id: true }
                })

                if (existingResource) {
                    console.log(`资源 ${result.dbId} 已存在，跳过`)
                    skipCount++
                    continue
                }

                // 创建资源
                const imageLink = `${process.env.IMAGE_BED_URL}/resource${getRouteByDbId(result.dbId)}/banner.avif`

                const resource = await prisma.resource.create({
                    data: {
                        name: result.name,
                        db_id: result.dbId,
                        author: result.author || '',
                        translator: result.translator || '',
                        introduction: result.introduction || '',
                        released: result.released || '',
                        accordion_total: Number(result.accordionTotal) || 0,
                        language: [], // 默认空数组
                        image_url: imageLink,
                        user_id: commentUser.id, // 使用 "前人遗论" 用户ID
                        accordion: 0,
                        status: 2,
                        download: parseInt(result.download) || 0,
                        view:
                            parseInt(result.view) <= parseInt(result.download)
                                ? parseInt(result.download)
                                : parseInt(result.view),
                        comment: result.comments.length || 0,
                        created: parseDate(result.created),
                        updated: parseDate(result.updated)
                    },
                    select: {
                        id: true,
                        db_id: true
                    }
                })

                // 创建别名
                if (result.alias && result.alias.length > 0) {
                    const aliasData = result.alias.map((name) => ({
                        name,
                        resource_id: resource.id
                    }))

                    await prisma.resourceAlias.createMany({
                        data: aliasData
                    })
                }

                // 创建评论
                if (result.comments && result.comments.length > 0) {
                    for (const comment of result.comments) {
                        // 构建评论内容，添加署名
                        const signature = comment.nickname || comment.ip_address
                        const contentWithSignature = `${comment.content}\n——${signature}`

                        await prisma.resourceComment.create({
                            data: {
                                content: contentWithSignature,
                                user_id: commentUser.id,
                                resource_id: resource.id,
                                created: parseDate(comment.created_at),
                                updated: parseDate(comment.updated_at)
                            }
                        })
                    }
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
