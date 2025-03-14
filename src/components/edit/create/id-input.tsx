'use client'

import { Input } from '@heroui/react'
import { useCreateResourceStore } from '@/store/editStore'

interface Props {
  errors: string | undefined
}

export const IdInput = ({ errors }: Props) => {
  const { data, setData } = useCreateResourceStore()

  return (
    <div className="w-full space-y-2">
      <h2 className="text-xl">DB ID (必选)</h2>
      <Input
        variant="underlined"
        labelPlacement="outside"
        color="primary"
        placeholder="请输入DB ID, 例如 a114514"
        value={data.dbId}
        onChange={(e) => setData({ ...data, dbId: e.target.value })}
        isInvalid={!!errors}
        errorMessage={errors}
      />
      <p className="text-sm ">
        提示: DB
        ID是用于标识资源唯一性以及判断资源类型，格式为【一位字母+六位数字】
      </p>
      <p className="text-sm text-default-500">
        a表示动漫，c表示漫画，n表示小说
      </p>
    </div>
  )
}
