'use client'

import { useState } from 'react'
import { Card, CardBody, Input, NumberInput } from '@heroui/react'
import { useCreateResourceStore } from '@/store/editStore'
import { IdInput } from './IdInput'
import { AliasInput } from './AliasInput'
import { BannerImage } from './BannerImage'
import { PublishButton } from './PublishButton'
import { ResourceIntroduction } from './ResourceIntroduction'
import { ReleasedDateInput } from './ReleasedDateInput'
import { LanguageSelect } from './LanguageSelect'
import type { CreateResourceRequestData } from '@/store/editStore'
import { GetBangumiData } from './GetBangumiData'

export const CreateContainer = () => {
  const { data, setData } = useCreateResourceStore()
  const [initialUrl, setInitialUrl] = useState<string>('')
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateResourceRequestData, string>>
  >({})

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">创建新资源</h1>
      </div>
      <form className="w-full max-w-5xl py-4 mx-auto">
        <Card className="w-full">
          <CardBody className="space-y-6">

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
              <GetBangumiData setInitialUrl={setInitialUrl} />
            </div>

            <IdInput errors={errors.dbId} />

            <div className="space-y-2">
              <h2 className="text-xl">资源作者 (必须)</h2>
              <Input
                isRequired
                variant="underlined"
                labelPlacement="outside"
                color="primary"
                placeholder="输入资源作者名称, 若有出版方可以用空格隔开"
                value={data.author}
                onChange={(e) => setData({ ...data, author: e.target.value })}
                isInvalid={!!errors.author}
                errorMessage={errors.author}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl">资源汉化组</h2>
              <Input
                variant="underlined"
                labelPlacement="outside"
                color="primary"
                placeholder="输入资源汉化组名称"
                value={data.translator}
                onChange={(e) => setData({ ...data, translator: e.target.value })}
                isInvalid={!!errors.translator}
                errorMessage={errors.translator}
              />
            </div>

            <LanguageSelect errors={errors.language} />

            <div className="space-y-2">
              <h2 className="text-xl">资源总集数</h2>
              <NumberInput
                labelPlacement="outside"
                placeholder="输入资源总集数"
                value={data.accordionTotal || 0}
                isWheelDisabled
                onValueChange={(value) =>
                  setData({ ...data, accordionTotal: value })
                }
                isInvalid={data.accordionTotal < 0}
                errorMessage={'总集数不能小于0'}
              />
            </div>

            <BannerImage errors={errors.banner} initialUrl={initialUrl} setInitialUrl={setInitialUrl} />

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
    </>
  )
}
