import { Tab, Tabs } from '@heroui/tabs'
import type { Dispatch, SetStateAction } from 'react'
import { IntroductionTab } from './introduction'
import { Introduction } from '@/types/common/detail-container'
import { ResourceTab } from './resource'
import { CommentTab } from './comment'

interface DetailTabsProps {
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
  introduce: Introduction
}

export const DetailTabs = ({
  selected,
  setSelected,
  introduce
}: DetailTabsProps) => {
  return (
    <Tabs
      className="w-full overflow-hidden shadow-medium rounded-large"
      fullWidth={true}
      defaultSelectedKey="introduction"
      onSelectionChange={(value) => {
        setSelected(value.toString())
      }}
      selectedKey={selected}
    >
      <Tab key="introduction" title="资源详情" className="p-0">
        <IntroductionTab intro={introduce} />
      </Tab>

      <Tab key="resources" title="下载资源" className="p-0">
        <ResourceTab />
      </Tab>

      <Tab key="comments" title="用户评论" className="p-0">
        <CommentTab />
      </Tab>
    </Tabs>
  )
}
