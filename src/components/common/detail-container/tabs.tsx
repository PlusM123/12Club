import { Tab, Tabs } from "@heroui/tabs"
import type { Dispatch, SetStateAction } from 'react'
import { IntroductionTab } from './introduction'
import type { Introduction } from './types'
import { ResourceTab } from './resource'
import { CommentTab } from './comment'

interface DetailTabsProps {
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
}

export const DetailTabs = ({ selected, setSelected }: DetailTabsProps) => {
  const introExample: Introduction = {
    text: '敗女的精髓藏於短篇故事中── 數量龐大的特典短篇、活動短篇以及豐橋綜合動植物公園合作短篇等，一共收錄四十篇以上！ 另外還有她們的生日等詳細個人資料……？ 欲熟知本作不可或缺，敗北女角們的幕間短短短篇集！',
    created: '2025-02-15',
    updated: '2023-10-05',
    released: '2022-12-25',
    vndbId: 'v12345',
    alias: ['123123123', '321321321321', '114514']
  }
  return (
    <Tabs
      className="w-full overflow-hidden shadow-medium rounded-large"
      fullWidth={true}
      defaultSelectedKey="introduction"
      onSelectionChange={(value) => {
        if (value === 'resources') {
          window.scroll(0, 400)
        }
        setSelected(value.toString())
      }}
      selectedKey={selected}
    >
      <Tab key="introduction" title="资源详情" className="p-0">
        <IntroductionTab intro={introExample} />
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
