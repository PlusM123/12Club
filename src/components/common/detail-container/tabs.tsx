import { Tab, Tabs } from '@nextui-org/tabs'
import type { Dispatch, SetStateAction } from 'react'

interface DetailTabsProps {
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
}

export const DetailTabs = ({ selected, setSelected }: DetailTabsProps) => {
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
      <Tab key="introduction" title="资源详情" className="p-0"></Tab>

      <Tab key="resources" title="下载资源" className="p-0"></Tab>

      <Tab key="comments" title="用户评论" className="p-0"></Tab>
    </Tabs>
  )
}
