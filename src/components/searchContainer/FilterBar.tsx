'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@heroui/dropdown'
import { Button } from '@heroui/button'
import { Card, CardHeader } from '@heroui/card'
import { Select, SelectItem } from '@heroui/select'
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, Filter } from 'lucide-react'
import {
  ALL_SUPPORTED_TYPE,
  SUPPORTED_TYPE_MAP,
  ALL_SUPPORTED_LANGUAGE,
  SUPPORTED_LANGUAGE_MAP,
  SORT_FIELD_LABEL_MAP
} from '@/constants/resource'
import { useSearchStore } from '@/store/searchStore'

import type { SortField, SortOrder } from '@/components/pageContainer/_sort'

export const FilterBar = () => {
  const searchData = useSearchStore((state) => state.data)
  const setSearchData = useSearchStore((state) => state.setData)

  return (
    <Card className="w-full border border-default-100 bg-content1/50 backdrop-blur-lg">
      <CardHeader>
        <div className="flex flex-col w-full gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          {/* <Select
            label="类型筛选"
            placeholder="选择类型"
            selectedKeys={[selectedType]}
            onChange={(event) => {
              setSelectedType(event.target.value)
            }}
            startContent={<Filter className="size-4 text-default-400" />}
            radius="lg"
            size="sm"
          >
            {ALL_SUPPORTED_TYPE.map((type) => (
              <SelectItem key={type} className="text-default-700">
                {SUPPORTED_TYPE_MAP[type]}
              </SelectItem>
            ))}
          </Select> */}

          <Select
            label="语言筛选"
            placeholder="选择语言"
            selectedKeys={[searchData.selectedLanguage]}
            onChange={(event) => {
              if (!event.target.value) {
                return
              }
              setSearchData({ ...searchData, selectedLanguage: event.target.value })
            }}
            startContent={<Filter className="size-4 text-default-400" />}
            radius="lg"
            size="sm"
          >
            {ALL_SUPPORTED_LANGUAGE.map((language) => (
              <SelectItem key={language} className="text-default-700">
                {SUPPORTED_LANGUAGE_MAP[language]}
              </SelectItem>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  style={{
                    fontSize: '0.875rem'
                  }}
                  endContent={<ChevronDown className="size-4" />}
                  radius="lg"
                  size="lg"
                >
                  {SORT_FIELD_LABEL_MAP[searchData.sortField]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="排序选项"
                selectedKeys={new Set([searchData.sortField])}
                onAction={(key) => {
                  setSearchData({ ...searchData, sortField: key as SortField })
                }}
                selectionMode="single"
                className="min-w-[120px]"
              >
                <DropdownItem key="updated" className="text-default-700">
                  更新时间
                </DropdownItem>
                <DropdownItem key="favorite_by" className="text-default-700">
                  收藏量
                </DropdownItem>
                <DropdownItem key="comment" className="text-default-700">
                  评论量
                </DropdownItem>
                <DropdownItem key="created" className="text-default-700">
                  创建时间
                </DropdownItem>
                <DropdownItem key="view" className="text-default-700">
                  播放量
                </DropdownItem>
                <DropdownItem key="download" className="text-default-700">
                  下载量
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              variant="flat"
              style={{
                fontSize: '0.875rem'
              }}
              onPress={() => {
                setSearchData({ ...searchData, sortOrder: searchData.sortOrder === 'asc' ? 'desc' : 'asc' })
              }}
              startContent={
                searchData.sortOrder === 'asc' ? (
                  <ArrowUpAZ className="size-4" />
                ) : (
                  <ArrowDownAZ className="size-4" />
                )
              }
              radius="lg"
              size="lg"
            >
              {searchData.sortOrder === 'asc' ? '升序' : '降序'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
