import { Card, CardBody, CardHeader } from '@heroui/card'
import { Comments } from './Comments'

interface Props {
  id: string
}

export const CommentTab = ({ id }: Props) => {
  return (
    <Card className="p-1 xl:p-8">
      <CardHeader className="p-4">
        <h2 className="text-2xl font-medium">用户评论</h2>
      </CardHeader>
      <CardBody className="p-4">
        <Comments id={id} />
      </CardBody>
    </Card>
  )
}
