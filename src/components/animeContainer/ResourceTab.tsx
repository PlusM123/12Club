'use client'

import { useEffect, useState } from 'react'
import type { JSX } from 'react'

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure
} from '@heroui/react'
import {
  Plus,
  Edit,
  MoreHorizontal,
  Trash2,
  Cloud,
  Link as LinkIcon,
  Database,
  Download,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Grid2X2,
  List
} from 'lucide-react'

import { ExternalLink } from '@/components/common/ExternalLink'
import { SUPPORTED_RESOURCE_LINK_MAP } from '@/constants/resource'
import { useUserStore } from '@/store/userStore'
import { FetchDelete, FetchGet, FetchPost, FetchPut } from '@/utils/fetch'

import { EditResourceDialog } from '../detailContainer/resource/edit/EditResourceDialog'
import { PublishResource } from '../detailContainer/resource/publish/PublishResource'

import type { PatchResource } from '@/types/api/patch'
import type { PlayListItem } from '@/types/common/detail-container'

type ViewMode = 'grid' | 'list'

const storageIcons: { [key: string]: JSX.Element } = {
  alist: <Cloud className="size-4" />,
  user: <LinkIcon className="size-4" />
}

interface ResourceTabProps {
  id: string
  playList: PlayListItem[]
  needUpdate?: boolean
}

export const ResourceTab = ({
  id,
  playList,
  needUpdate = false
}: ResourceTabProps) => {
  const { user } = useUserStore((state) => state)
  const [resources, setResources] = useState<PatchResource[]>([])
  const [individualLoaded, setIndividualLoaded] = useState(false)

  // 官方下载：分集选择相关状态
  const [isAscending, setIsAscending] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // 个人资源后台加载，不显示 loading
  useEffect(() => {
    const fetchData = async () => {
      const res = await FetchGet<PatchResource[]>('/patch', {
        dbId: id
      })
      setResources(res)
      setIndividualLoaded(true)
    }
    fetchData()
  }, [id, needUpdate])

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate
  } = useDisclosure()

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit
  } = useDisclosure()
  const [editResource, setEditResource] = useState<PatchResource | null>(null)

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()
  const [deleteResourceId, setDeleteResourceId] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [showLinks, setShowLinks] = useState<Record<number, boolean>>({})

  const handleDeleteResource = async () => {
    setDeleting(true)
    await FetchDelete<object>('/patch', {
      patchId: deleteResourceId
    })
    setResources((prev) =>
      prev.filter((resource) => resource.id !== deleteResourceId)
    )
    setDeleteResourceId(0)
    setDeleting(false)
    onCloseDelete()
    addToast({
      title: '成功',
      description: '删除资源链接成功',
      color: 'success'
    })
  }

  // 点击下载按钮，统计下载量并显示链接
  const handleClickDownload = async (resource: PatchResource) => {
    if (showLinks[resource.id]) {
      setShowLinks((prev) => ({
        ...prev,
        [resource.id]: false
      }))
      return
    }

    await FetchPut<object>('/patch/download', {
      resourceId: resource.resourceId,
      patchId: resource.id
    })

    setShowLinks((prev) => ({
      ...prev,
      [resource.id]: true
    }))
  }

  // 点击官方分集下载按钮，使用隐藏 a 标签触发下载避免弹窗闪烁
  const handleEpisodeDownload = (item: PlayListItem) => {
    if (item.link) {
      const a = document.createElement('a')
      a.href = item.link
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      FetchPost<object>('/detail/download', { resourceDbId: id })
    }
  }

  // 个人资源列表
  const individualResources = resources.filter(
    (resource) => resource.section === 'individual'
  )

  // 排序后的播放列表
  const sortedPlayList = isAscending ? [...playList] : [...playList].reverse()

  return (
    <Card>
      <CardHeader className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">下载资源</h3>
          {playList.length > 0 && (
            <span className="text-sm text-default-400">
              ({playList.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            color="primary"
            variant="light"
            size="sm"
            startContent={<Plus className="size-4" />}
            onPress={onOpenCreate}
          >
            添加
          </Button>
          {playList.length > 0 && (
            <>
              <Button
                variant="light"
                size="sm"
                isIconOnly
                className="text-default-500"
                onPress={() =>
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                }
              >
                {viewMode === 'grid' ? (
                  <List className="size-5" />
                ) : (
                  <Grid2X2 className="size-5" />
                )}
              </Button>

              <Button
                variant="light"
                size="sm"
                isIconOnly
                className="text-default-500"
                onPress={() => setIsAscending(!isAscending)}
              >
                {isAscending ? (
                  <ArrowDownWideNarrow className="size-5" />
                ) : (
                  <ArrowUpNarrowWide className="size-5" />
                )}
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardBody className="px-4 pt-0 pb-4 space-y-4">
        {/* 官方资源 - 分集下载 */}
        {playList.length > 0 && (
          <div>
            <ScrollShadow className="max-h-80" hideScrollBar>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {sortedPlayList.map((item, index) => {
                    const displayText =
                      item.showAccordion || item.accordion.toString()

                    return (
                      <Button
                        key={index}
                        variant="flat"
                        color="primary"
                        className="w-full aspect-square min-w-0 p-0 flex flex-col items-center justify-center text-lg"
                        onPress={() => handleEpisodeDownload(item)}
                      >
                        {displayText}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {sortedPlayList.map((item, index) => {
                    const displayText =
                      item.showAccordion || item.accordion.toString()

                    return (
                      <Button
                        key={index}
                        variant="flat"
                        color="primary"
                        className="w-full h-10 min-w-0 px-4 flex items-center justify-between text-sm"
                        endContent={<Download className="size-4" />}
                        onPress={() => handleEpisodeDownload(item)}
                      >
                        <span className="font-medium">第{displayText}话</span>
                      </Button>
                    )
                  })}
                </div>
              )}
            </ScrollShadow>
          </div>
        )}

        {/* 个人资源 - 后台加载完成后展示 */}
        {individualLoaded && individualResources.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">个人资源</span>
              <span className="text-xs text-default-400">
                ({individualResources.length})
              </span>
            </div>

            <ScrollShadow className="max-h-80" hideScrollBar>
              <div className="space-y-3">
                {individualResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-3 rounded-lg bg-default-50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {resource.name}
                        </p>
                        {resource.note && (
                          <p className="text-xs text-default-500 mt-1 line-clamp-2">
                            {resource.note}
                          </p>
                        )}
                      </div>

                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            className="shrink-0"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="资源操作"
                          disabledKeys={
                            user.uid !== resource.userId && user.role < 3
                              ? ['edit', 'delete']
                              : []
                          }
                        >
                          <DropdownItem
                            key="edit"
                            startContent={<Edit className="size-4" />}
                            onPress={() => {
                              setEditResource(resource)
                              onOpenEdit()
                            }}
                          >
                            编辑
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 className="size-4" />}
                            onPress={() => {
                              setDeleteResourceId(resource.id)
                              onOpenDelete()
                            }}
                          >
                            删除
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          size="sm"
                          color="secondary"
                          variant="flat"
                          startContent={storageIcons[resource.storage]}
                        >
                          {
                            SUPPORTED_RESOURCE_LINK_MAP[
                              resource.storage as 'alist' | 'user'
                            ]
                          }
                        </Chip>
                        {resource.size && (
                          <Chip
                            size="sm"
                            variant="flat"
                            startContent={<Database className="size-3" />}
                          >
                            {resource.size}
                          </Chip>
                        )}
                      </div>

                      <Button
                        color="primary"
                        size="sm"
                        isIconOnly
                        variant={showLinks[resource.id] ? 'solid' : 'flat'}
                        aria-label="下载资源"
                        onPress={() => handleClickDownload(resource)}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>

                    {showLinks[resource.id] && (
                      <div className="space-y-1 pt-2 border-t border-default-200">
                        <p className="text-xs text-default-500">
                          点击下面的链接以下载
                        </p>
                        {resource.content.split(',').map((link, index) => (
                          <ExternalLink
                            key={index}
                            underline="hover"
                            link={link}
                            className="text-xs break-all w-full"
                          >
                            <span className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                              {link}
                            </span>
                          </ExternalLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </div>
        )}

        {/* 无数据提示 */}
        {playList.length === 0 &&
          individualLoaded &&
          individualResources.length === 0 && (
            <div className="py-8 text-center text-default-500 text-sm">
              暂无下载资源
            </div>
          )}
      </CardBody>

      {/* 创建资源弹窗 */}
      <Modal
        size="2xl"
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        scrollBehavior="inside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        classNames={{
          wrapper: 'z-[9999]',
          backdrop: 'z-[9998]'
        }}
        backdrop="blur"
      >
        <PublishResource
          dbId={id}
          onClose={onCloseCreate}
          onSuccess={(res) => {
            setResources([...resources, res])
            onCloseCreate()
          }}
        />
      </Modal>

      {/* 编辑资源弹窗 */}
      <Modal
        size="2xl"
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        scrollBehavior="inside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        classNames={{
          wrapper: 'z-[9999]',
          backdrop: 'z-[9998]'
        }}
        backdrop="blur"
      >
        <EditResourceDialog
          onClose={onCloseEdit}
          resource={editResource!}
          onSuccess={(res) => {
            setResources((prevResources) =>
              prevResources.map((resource) =>
                resource.id === res.id ? res : resource
              )
            )
            onCloseEdit()
          }}
        />
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        placement="center"
        classNames={{
          wrapper: 'z-[9999]',
          backdrop: 'z-[9998]'
        }}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>删除资源链接</ModalHeader>
          <ModalBody>
            <p>您确定要删除这条资源链接吗，该操作不可撤销</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseDelete}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteResource}
              disabled={deleting}
              isLoading={deleting}
            >
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  )
}
