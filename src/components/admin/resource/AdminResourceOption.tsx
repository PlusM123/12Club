'use client'

import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@heroui/react'
import { Settings } from 'lucide-react'
import { useAdminResourceStore } from '@/store/adminResourceStore'

export const AdminResourceOption = () => {
  const searchData = useAdminResourceStore((state) => state.data)
  const setSearchData = useAdminResourceStore((state) => state.setData)

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="flat" color="primary">
          <Settings className="w-5 h-5" />
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
