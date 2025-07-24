import { getActions } from './actions'
import { HomeContainer } from '@/components/HomeContainer'

export default async function Home() {
  const response = await getActions()

  return <HomeContainer {...response} />
}
