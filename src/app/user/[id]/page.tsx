import { redirect } from 'next/navigation'

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/user/${id}/comment`)
  return <p>{id}</p>
}
