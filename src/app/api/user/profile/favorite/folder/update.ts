import { z } from 'zod'
import { prisma } from '../../../../../../../prisma'
import { updateFavoriteFolderSchema } from '@/validations/user'
import type { UserFavoriteResourceFolder } from '@/types/api/user'

export const updateFolder = async (
  input: z.infer<typeof updateFavoriteFolderSchema>,
  uid: number
) => {
  const folder = await prisma.UserResourceFavoriteFolder.update({
    where: { id: input.folderId, user_id: uid },
    data: {
      name: input.name,
      description: input.description,
      is_public: input.isPublic
    },
    include: {
      _count: {
        select: { resource: true }
      }
    }
  })

  const response: UserFavoriteResourceFolder = {
    name: folder.name,
    id: folder.id,
    description: folder.description,
    is_public: folder.is_public,
    isAdd: false,
    _count: folder._count
  }

  return response
}
