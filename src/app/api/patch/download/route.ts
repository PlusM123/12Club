import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParsePutBody } from '@/utils/parse-query'
import { updatePatchResourceStatsSchema } from '@/validations/patch'
import { createClient } from '@/supabase'

export const downloadStats = async (
  input: z.infer<typeof updatePatchResourceStatsSchema>
) => {
  const supabase = await createClient()

  const { data: currentResource } = await supabase
    .from('resource')
    .select('download')
    .match({ id: input.resourceId })
    .single()

  const { data: currentPatch } = await supabase
    .from('resource_patch')
    .select('download')
    .match({ id: input.patchId })
    .single()

  const {} = await supabase
    .from('resource')
    .update({ download: currentResource?.download + 1 })
    .eq('id', input.resourceId)

  const {} = await supabase
    .from('resource_patch')
    .update({ download: currentPatch?.download + 1 })
    .eq('id', input.patchId)

  return {}
}

export const PUT = async (req: NextRequest) => {
  const input = await ParsePutBody(req, updatePatchResourceStatsSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const response = await downloadStats(input)
  return NextResponse.json(response)
}
