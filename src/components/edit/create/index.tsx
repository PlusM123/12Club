'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader, Input, NumberInput } from '@heroui/react'
import { useCreateResourceStore } from '@/store/editStore'
import { IdInput } from './id-input'
import { AliasInput } from './alias-input'
import { BannerImage } from './banner-image'
import { PublishButton } from './publish-button'
import { ResourceIntroduction } from './resource-introduction'
import { ReleasedDateInput } from './released-date-input'
import { LanguageSelect } from './language-select'
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
              color="primary"
              placeholder="输入资源名称, 这会作为资源的标题"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl">资源作者 (必须)</h2>
            <Input
              isRequired
              variant="underlined"
              labelPlacement="outside"
              color="primary"
              placeholder="输入资源作者名称, 这会作为资源的作者"
              value={data.author}
              onChange={(e) => setData({ ...data, author: e.target.value })}
              isInvalid={!!errors.author}
              errorMessage={errors.author}
            />
          </div>

          <LanguageSelect errors={errors.language} />

          <div className="space-y-2">
            <h2 className="text-xl">资源总集数 (必须)</h2>
            <NumberInput
              isRequired
              labelPlacement="outside"
              placeholder="输入资源总集数"
              value={data.accordionTotal}
              onValueChange={(value) =>
                setData({ ...data, accordionTotal: value })
              }
              isInvalid={!!errors.author}
              errorMessage={errors.author}
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

          <PublishButton setErrors={setErrors} />
        </CardBody>
      </Card>
    </form>
  )
}
