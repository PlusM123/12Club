'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader, Input } from '@heroui/react'
import { useCreateResourceStore } from '@/store/editStore'
import { IdInput } from './id-input'
import { AliasInput } from './alias-input'
import { BannerImage } from './banner-image'
// import { PublishButton } from './PublishButton'
import { ResourceIntroduction } from './resource-introduction'
import { ReleasedDateInput } from './released-date-input'
import type { CreateResourceRequestData } from '@/store/editStore'

export const CreateContainer = () => {
  const { data, setData } = useCreateResourceStore()
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateResourceRequestData, string>>
  >({})

  return (
    <form className="w-full max-w-5xl py-4 mx-auto">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl">创建新资源</h1>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <IdInput errors={errors.dbId} />

          <div className="space-y-2">
            <h2 className="text-xl">资源名称 (必须)</h2>
            <Input
              isRequired
              variant="underlined"
              labelPlacement="outside"
              placeholder="输入资源名称, 这会作为资源的标题"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
          </div>

          <BannerImage errors={errors.banner} />

          <ResourceIntroduction errors={errors.banner} />

          <AliasInput errors={errors.alias} />

          <ReleasedDateInput
            date={data.released}
            setDate={(date) => {
              setData({ ...data, released: date })
            }}
            errors={errors.released}
          />

          {/* <PublishButton setErrors={setErrors} /> */}
        </CardBody>
      </Card>
    </form>
  )
}
