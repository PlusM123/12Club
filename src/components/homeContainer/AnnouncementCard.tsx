'use client'

import { Card, CardBody, CardHeader, Chip, Link } from '@heroui/react'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow'
import type { Announcement } from '@/types/api/announcement'

interface Props {
    announcements: Announcement[]
    currentSlide: number
}

export const AnnouncementCard = ({ announcements, currentSlide }: Props) => {
    const announcement = announcements[currentSlide]

    return (
        <div className="h-full group">
            <Card className="absolute border-none top-0 bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md p-4">
                <CardHeader>
                    {announcement.title}
                </CardHeader>
                <CardBody>
                    <div className="h-full flex flex-col justify-between">
                        <p className="mb-2 text-sm text-foreground/80 line-clamp-1">
                            {announcement.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Chip variant="flat" size="sm">
                                {formatDistanceToNow(announcement.created)}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default AnnouncementCard