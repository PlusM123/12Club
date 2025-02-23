import { Card, CardBody } from '@nextui-org/card'
import { Button, Chip } from '@nextui-org/react'
import { Download, Database, File } from 'lucide-react'

interface Props {
  id?: number
}

export const ResourceTab = ({ id }: Props) => {
  return (
    <Card className="p-1 lg:p-8">
      <CardBody className="p-4">
        <div className="max-w-none">
          <h2 className="text-2xl pb-4 font-medium">资源链接</h2>
          <p>
            请注意, 本站的下载资源均来自互联网或用户上传,
            仅供参考与学习，请在下载后于24小时内删除。
          </p>

          <Card className="w-full p-4 mt-8" shadow="md">
            <CardBody className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2">
                <Chip
                  color="secondary"
                  variant="flat"
                  size="sm"
                  startContent={<File className="w-4 h-4" />}
                >
                  MP4
                </Chip>
                <Chip
                  variant="flat"
                  size="sm"
                  startContent={<Database className="w-4 h-4" />}
                >
                  15.2 MB
                </Chip>
              </div>

              <Button color="primary" isIconOnly aria-label="下载游戏">
                <Download className="size-5" />
              </Button>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  )
}
