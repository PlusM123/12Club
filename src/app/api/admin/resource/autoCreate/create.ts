import { z } from 'zod'
import { prisma } from '../../../../../../prisma'
import { adminAutoCreateResourcePlayLinkSchema } from '@/validations/admin'
import type { ResourcePlayLink } from '@/types/api/resource-play-link'
import { createPatchResource } from '@/app/api/patch/create'

export const autoCreateResourcePlayLinks = async (
    input: z.infer<typeof adminAutoCreateResourcePlayLinkSchema>,
    userId: number
) => {
    const { resourceId, linkList } = input

    try {
        // 检查资源是否存在
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            select: { id: true, accordion_total: true, name: true, language: true, db_id: true }
        })

        if (!resource) {
            return {
                success: false,
                message: '资源不存在'
            }
        }

        const existingPatch = await prisma.resourcePatch.findFirst({
            where: {
                resource_id: resource.id,
                content: `//12club.nankai.edu.cn/openlist/anime/${resource.db_id}`
            }
        })

        if (!existingPatch) {
            const patchRes = await createPatchResource
                ({
                    dbId: resource.db_id,
                    language: resource.language,
                    content: `//12club.nankai.edu.cn/openlist/anime/${resource.db_id}`,
                    storage: 'alist',
                    section: 'club',
                    name: `${resource.name} - 12club资源`,
                    code: '',
                    hash: '',
                    size: '',
                    password: '',
                    note: ''
                }, userId)

            if (typeof patchRes === 'string') {
                return {
                    success: false,
                    message: patchRes
                }
            }
        }

        // 检查是否已有播放链接
        const currentLinks = await prisma.resourcePlayLink.findMany({
            where: {
                resource_id: resourceId
            },
            select: { accordion: true, link: true }
        })

        const errors: string[] = []
        const removeHttpPrefix = (url: string) => {
            return url.replace(/^https?:/, '')
        }

        // 批量创建播放链接
        for (let i = 0; i < linkList.length; i++) {
            const link = linkList[i]
            const accordion = i + 1

            try {

                if (currentLinks.some((currentLink) => currentLink.link === removeHttpPrefix(link))) {
                    continue
                } else {
                    await prisma.resourcePlayLink.create({
                        data: {
                            resource_id: resourceId,
                            user_id: userId,
                            accordion,
                            show_accordion: accordion.toString(),
                            link: removeHttpPrefix(link),
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true
                                }
                            }
                        }
                    })
                }
            } catch (error) {
                console.error(`创建第 ${accordion} 集播放链接失败:`, error)
                errors.push(`第 ${accordion} 集: ${error instanceof Error ? error.message : '创建失败'}`)
            }
        }

        // 更新资源的更新时间
        if (linkList.length > currentLinks.length) {
            await prisma.resource.update({
                where: { id: resourceId },
                data: {
                    accordion_total: linkList.length
                }
            })
        }

        const resultPlayLinks = await prisma.resourcePlayLink.findMany({
            where: {
                resource_id: resourceId
            },
            select: {
                id: true,
                accordion: true,
                show_accordion: true,
                resource_id: true,
                user_id: true,
                link: true,
                created: true,
                updated: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        })

        const formattedResultPlayLinks: ResourcePlayLink[] = resultPlayLinks.map((playLink) => ({
            id: playLink.id,
            accordion: playLink.accordion,
            show_accordion: playLink.show_accordion,
            resource_id: playLink.resource_id,
            user_id: playLink.user_id,
            link: playLink.link,
            created: playLink.created,
            updated: playLink.updated,
            user: playLink.user
        }))

        if (errors.length > 0) {
            return {
                success: false,
                message: `批量创建部分失败：\n${errors.join('\n')}`,
                data: {
                    created: formattedResultPlayLinks.length,
                    failed: errors.length,
                    details: errors
                }
            }
        }

        return {
            success: true,
            message: `成功${!existingPatch ? '创建' + formattedResultPlayLinks.length : '更新' + (linkList.length - currentLinks.length)} 个播放链接${!existingPatch ? ' 和 下载资源' : ''}`,
            data: {
                created: formattedResultPlayLinks.length,
                failed: 0,
                details: formattedResultPlayLinks
            }
        }
    } catch (error) {
        console.error('批量创建播放链接失败:', error)

        // 处理特定的 Prisma 错误
        if (error && typeof error === 'object' && 'code' in error) {
            const prismaError = error as { code: string; meta?: any }

            if (prismaError.code === 'P2002') {
                return {
                    success: false,
                    message: '播放链接存在重复，请检查集数设置'
                }
            }

            if (prismaError.code === 'P2003') {
                return {
                    success: false,
                    message: '关联的资源或用户不存在'
                }
            }
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : '批量创建播放链接时发生未知错误'
        }
    }
} 