import { getActions } from './actions'
import { HomeContainer } from '@/components/home-container'

export default async function Home() {
  const response = await getActions()

  return <HomeContainer {...response} />
}
