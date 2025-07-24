import { Chip } from '@heroui/chip'
import { Card, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow'
import Link from 'next/link'
import { PatchAttribute } from '@/components/common/PatchAttribute'
import { getRouteByDbId } from '@/utils/router'
import type { UserResource as UserResourceType } from '@/types/api/user'
import { ExternalLink } from '@/components/common/ExternalLink'

interface Props {
  resource: UserResourceType
}

export const UserResourceCard = ({ resource }: Props) => {
  const bannerImageSrc = resource.patchBanner
    ? resource.patchBanner.replace(/\.avif$/, '-mini.avif')
    : '/touchgal.avif'

  return (
    <Card
      isPressable
      as={Link}
      href={getRouteByDbId(resource.patchUniqueId)}
      className="w-full"
    >
      <CardBody className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:h-auto sm:w-40">
            <Image
              src={bannerImageSrc}
              alt={resource.patchName}
              className="object-cover rounded-lg size-full max-h-52"
              radius="lg"
            />
          </div>
          <div className="flex w-full flex-col justify-between space-y-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h2 className="text-lg font-semibold transition-colors line-clamp-2 hover:text-primary-500">
                  {resource.patchName}
                </h2>
                <Chip variant="flat">
                  {formatDistanceToNow(resource.created)}
                </Chip>
              </div>

              <PatchAttribute
                types={resource.type}
                languages={resource.language}
                size={resource.size}
                attributeSize="sm"
              />
            </div>

            <div>
              {resource.content.split(',').map((link) => (
                <ExternalLink
                  key={link}
                  link={link}
                  underline="always"
                  showAnchorIcon={false}
                >
                  {link}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
