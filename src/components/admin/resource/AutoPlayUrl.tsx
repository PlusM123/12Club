import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    addToast,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip
} from "@heroui/react";
import { useEffect, useState } from "react"
import { Edit2, ExternalLink } from 'lucide-react'
import type { AdminResource } from "@/types/api/admin"

export function AutoPlayUrl({ resource }: { resource: AdminResource }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [linkList, setLinkList] = useState<string[]>(['111', '222', '333']);

    const removeHttpPrefix = (url: string) => {
        return url.replace(/^https?:/, '')
    }

    const fetchDetailData = async () => {
        const getToken = await fetch(`${process.env.NEXT_OPENLIST_API_ADRESS}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": process.env.NEXT_OPENLIST_USERNAME,
                "password": process.env.NEXT_OPENLIST_PASSWORD
            })
        });

        if (!getToken.ok) {
            addToast({
                title: '错误',
                description: '获取token失败',
                color: 'danger'
            });
            return;
        }

        const tokenData = await getToken.json();
        const openlistToken = tokenData.data["token"]
        const path = `/resource/anime/${resource.dbId}`

        const getFileList = await fetch(`${process.env.NEXT_OPENLIST_API_ADRESS}/fs/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': openlistToken
            },
            body: JSON.stringify({
                "path": path
            })
        });

        if (!getFileList.ok) {
            addToast({
                title: '错误',
                description: '获取文件列表数据失败',
                color: 'danger'
            });
            return;
        }

        const fileListData = await getFileList.json()
        const filePathList = fileListData.data['content'].filter((item: any) => item.name !== "banner.avif");

        const fileList = filePathList.map((item: any) => {
            return encodeURI(`${process.env.IMAGE_BED_URL}/d${path}/${item.name}`)
        })
        setLinkList(fileList)
    };

    useEffect(() => {
        fetchDetailData()
    }, [])

    const createPlayLink = async (onClose: () => void) => {
        try {
            const response = await fetch('/api/admin/resource/autoCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceId: resource.id,
                    linkList: linkList
                })
            })

            const result = await response.json()

            if (result.success) {
                addToast({
                    title: '成功',
                    description: result.message,
                    color: 'success'
                })
            } else {
                addToast({
                    title: '错误',
                    description: result.message,
                    color: 'danger'
                })
            }
        } catch (error) {
            addToast({
                title: '错误',
                description: '创建播放链接失败',
                color: 'danger'
            })
        }
        onClose()
    }


    return (
        <>
            <Button
                color={"success"}
                onPress={async () => {
                    await fetchDetailData()
                    onOpen()
                }}>
                自动填写播放链接与官方资源
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">二次确认</ModalHeader>
                            <ModalBody>
                                请确保数据openlist对应的文件夹下添加了资源，并且资源名称升序排列和集数对应
                                <Table aria-label="播放链接列表">
                                    <TableHeader>
                                        <TableColumn width={100}>集数序号</TableColumn>
                                        <TableColumn>播放链接</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {linkList?.map((link, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Chip color="primary" variant="flat">
                                                        {index + 1}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate max-w-xs" title={link}>
                                                            {removeHttpPrefix(link)}
                                                        </span>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onPress={() => window.open(link, '_blank')}
                                                        >
                                                            <ExternalLink size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    取消
                                </Button>
                                <Button color="primary" onPress={() => createPlayLink(onClose)}>
                                    确认
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}