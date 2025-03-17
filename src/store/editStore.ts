import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CreateResourceData {
  name: string
  author: string
  accordionTotal: number
  introduction: string
  language: string
  dbId: string
  alias: string[]
  tag: string[]
  released: string
}

export interface CreateResourceRequestData extends CreateResourceData {
  banner: Blob | null
}

interface StoreState {
  data: CreateResourceData
  getData: () => CreateResourceData
  setData: (data: CreateResourceData) => void
  resetData: () => void
}

const initialState: CreateResourceData = {
  name: '',
  author: '',
  accordionTotal: 0,
  language: 'other',
  introduction: '',
  dbId: '',
  alias: [],
  tag: [],
  released: ''
}

export const useCreateResourceStore = create<StoreState>()(
  persist(
    (set, get) => ({
      data: initialState,
      getData: () => get().data,
      setData: (data: CreateResourceData) => set({ data }),
      resetData: () => set({ data: initialState })
    }),
    {
      name: 'edit-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
