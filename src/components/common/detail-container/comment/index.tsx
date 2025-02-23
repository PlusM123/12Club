import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Comments } from './comments'

interface Props {
  id?: number
}

export const CommentTab = ({ id }: Props) => {
  return (
    <Card className="p-1 sm:p-8">
      <CardHeader className="p-4">
        <h2 className="text-2xl font-medium">用户评论</h2>
      </CardHeader>
      <CardBody className="p-4">
        <Comments id={Number(id)} />
      </CardBody>
    </Card>
  )
}
