import { Forgot } from '@/components/admin/forgot'
import { getActions } from './actions'
import { ErrorComponent } from '@/components/common/Error'
import { Suspense } from 'react'



export const revalidate = 3

export default async function AdminForgotPage() {
    const response = await getActions({
        page: 1,
        limit: 10
    })

    if (typeof response === 'string') {
        return <ErrorComponent error={response} />
    }

    return (
        <Suspense>
            <Forgot
                initialResetCodes={response.resetCodes}
                initialTotal={response.total}
                initialStats={response.stats}
            />
        </Suspense>
    )
}
