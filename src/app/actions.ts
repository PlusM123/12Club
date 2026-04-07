import { getHomeData } from './api/home/get'

export const getActions = async () => {
  const response = await getHomeData()

  return response
}
