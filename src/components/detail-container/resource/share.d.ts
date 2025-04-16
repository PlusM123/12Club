import type { Control, FieldErrors } from 'react-hook-form'

interface Fields {
  type: string[]
  name: string
  section: string
  dbId: string
  code: string
  storage: string
  hash: string
  content: string
  size: string
  password: string
  note: string
  language: string[]
}

export interface FileStatus {
  file: File
  progress: number
  error?: string
  hash?: string
  filetype?: string
}

export type ErrorType = FieldErrors<Fields>
export type ControlType = Control<Fields, any>
