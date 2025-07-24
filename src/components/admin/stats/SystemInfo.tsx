'use client'

import { FC, useEffect, useState } from 'react'
import { Card, CardBody, Progress, Chip, Button, Accordion, AccordionItem } from '@heroui/react'
import { Cpu, HardDrive, MemoryStick, Clock, Monitor, RefreshCw } from 'lucide-react'
import { FetchGet } from '@/utils/fetch'
import { ErrorHandler } from '@/utils/errorHandler'
import { MasonryGrid } from '@/components/common/MasonryGrid'
import type { SystemInfo as SystemInfoType } from '@/types/api/admin'

export const SystemInfo: FC = () => {
    const [systemInfo, setSystemInfo] = useState<SystemInfoType | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

    const fetchSystemInfo = async (isInitialFrtch = false) => {
        if (!isInitialFrtch) setRefreshing(true)
        else setLoading(true)

        const res = await FetchGet<SystemInfoType>('/admin/stats/system')
        ErrorHandler(res, (data) => {
            setSystemInfo(data)
            setLastRefresh(new Date())
        })

        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => {
        fetchSystemInfo(true)
        // 每30秒刷新一次系统信息
        const interval = setInterval(() => fetchSystemInfo(false), 30000)
        return () => clearInterval(interval)
    }, [])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor((seconds % 86400) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${days}天 ${hours}小时 ${minutes}分钟`
    }

    const getUsageColor = (percentage: number) => {
        if (percentage < 50) return 'success'
        if (percentage < 80) return 'warning'
        return 'danger'
    }

    if (loading || !systemInfo) {
        return (
            <Card>
                <CardBody>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-default-500">正在加载系统信息...</div>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Monitor size={24} className="hidden 2xl:block" />
                    系统状况
                </h2>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-default-500">
                        {lastRefresh && (
                            <span>
                                更新于: {lastRefresh.toLocaleTimeString()} (每30秒自动刷新)
                            </span>
                        )}
                    </div>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => fetchSystemInfo(true)}
                        isLoading={refreshing}
                        isDisabled={refreshing}
                    >
                        <RefreshCw size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                {/* CPU 使用率 */}
                <Card>
                    <CardBody className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Cpu size={20} className="text-primary" />
                            <span className="font-semibold">CPU 使用率</span>
                        </div>
                        <Progress
                            value={systemInfo.cpu.usage}
                            color={getUsageColor(systemInfo.cpu.usage)}
                            className="w-full"
                            showValueLabel
                        />
                        <div className="text-sm text-default-500">
                            <div>{systemInfo.cpu.model}</div>
                            <div>{systemInfo.cpu.cores} 核心</div>
                        </div>
                    </CardBody>
                </Card>

                {/* 内存使用率 */}
                <Card>
                    <CardBody className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MemoryStick size={20} className="text-success" />
                            <span className="font-semibold">内存使用率</span>
                        </div>
                        <Progress
                            value={systemInfo.memory.usagePercent}
                            color={getUsageColor(systemInfo.memory.usagePercent)}
                            className="w-full"
                            showValueLabel
                        />
                        <div className="text-sm text-default-500">
                            <div>已用: {formatBytes(systemInfo.memory.used)}</div>
                            <div>总计: {formatBytes(systemInfo.memory.total)}</div>
                        </div>
                    </CardBody>
                </Card>

                {/* 硬盘使用率 */}
                <Card>
                    <CardBody className="space-y-3">
                        <div className="flex items-center gap-2">
                            <HardDrive size={20} className="text-warning" />
                            <span className="font-semibold">硬盘使用率(总计)</span>
                        </div>
                        <Progress
                            value={systemInfo.disk.usagePercent}
                            color={getUsageColor(systemInfo.disk.usagePercent)}
                            className="w-full"
                            showValueLabel
                        />
                        <div className="text-sm text-default-500">
                            <div>已用: {formatBytes(systemInfo.disk.used)}</div>
                            <div>总计: {formatBytes(systemInfo.disk.total)}</div>
                        </div>
                    </CardBody>
                </Card>

                {/* 系统信息 */}
                <Card>
                    <CardBody className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-secondary" />
                            <span className="font-semibold">系统信息</span>
                        </div>
                        <div className="space-y-2 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-2">
                                <Chip color="primary" variant="flat" size="sm">
                                    {systemInfo.platform}
                                </Chip>
                                <Chip color="primary" variant="flat" size="sm">
                                    {systemInfo.distro}
                                </Chip>
                                <Chip color="primary" variant="flat" size="sm">
                                    {systemInfo.release}
                                </Chip>
                            </div>
                            <div className="text-sm text-default-500">
                                <p>运行时间:</p>
                                <p>{formatUptime(systemInfo.uptime)}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* 硬盘分区详细信息 */}
            {systemInfo.diskPartitions && systemInfo.diskPartitions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HardDrive size={20} className="hidden 2xl:block" />
                        硬盘分区详情
                    </h3>

                    <Accordion variant="splitted">
                        <AccordionItem
                            key="disk-partitions"
                            aria-label="硬盘分区详情"
                            title={`查看 ${systemInfo.diskPartitions.length} 个分区详情`}
                        >
                            <MasonryGrid
                                columnWidth={300}
                                gap={16}
                                className="w-full"
                            >
                                {systemInfo.diskPartitions.map((partition, index) => (
                                    <Card key={index} className="w-full">
                                        <CardBody className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold">分区 {index + 1}</div>
                                                <Chip
                                                    color={getUsageColor(partition.usagePercent)}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {partition.usagePercent}%
                                                </Chip>
                                            </div>

                                            <Progress
                                                value={partition.usagePercent}
                                                color={getUsageColor(partition.usagePercent)}
                                                className="w-full"
                                                showValueLabel={false}
                                            />

                                            <div className="text-sm text-default-500 space-y-1">
                                                <div><strong>挂载点:</strong> {partition.mount}</div>
                                                <div><strong>文件系统:</strong> {partition.fs}</div>
                                                <div><strong>类型:</strong> {partition.type}</div>
                                                <div><strong>总容量:</strong> {formatBytes(partition.size)}</div>
                                                <div><strong>已使用:</strong> {formatBytes(partition.used)}</div>
                                                <div><strong>可用空间:</strong> {formatBytes(partition.available)}</div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </MasonryGrid>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )
} 