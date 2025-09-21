'use client'

import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@heroui/react'
import { Settings } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'

export const SearchOption = () => {
  const searchData = useSearchStore((state) => state.data)
  const setSearchData = useSearchStore((state) => state.setData)

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="flat" color="primary" className="w-12 h-12">
          <Settings className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col flex-wrap gap-3 p-3">
          <Checkbox
            isSelected={searchData.searchInAnime}
            onValueChange={(checked) =>
                setSearchData({ ...searchData, searchInAnime: checked })
            }
          >
            包含动漫
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInComic}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInComic: checked })
            }
          >
            包含漫画
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInGame}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInGame: checked })
            }
          >
            包含游戏
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInNovel}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInNovel: checked })
            }
          >
            包含小说
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInIntroduction}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInIntroduction: checked })
            }
          >
            在简介中搜索
          </Checkbox>
          <Checkbox
            isSelected={searchData.searchInAlias}
            onValueChange={(checked) =>
              setSearchData({ ...searchData, searchInAlias: checked })
            }
          >
            搜索别名
          </Checkbox>
        </div>
      </PopoverContent>
    </Popover>
  )
}