export const dynamic = 'force-dynamic'
export const revalidate = 0
import { getActions } from './actions'
import { HomeContainer } from '@/components/homeContainer'

export default async function Home() {
  const response = await getActions()

  return <HomeContainer {...response} />
}
