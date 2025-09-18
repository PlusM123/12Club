import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminResourceStore {
  searchInAnime: boolean
  searchInComic: boolean
  searchInGame: boolean
  searchInNovel: boolean
}

const initialState: AdminResourceStore = {
  searchInAnime: true,
  searchInComic: true,
  searchInGame: true,
  searchInNovel: true
}

interface AdminResourceStoreState {
  data: AdminResourceStore
  getData: () => AdminResourceStore
  setData: (data: AdminResourceStore) => void
  resetData: () => void
}

export const useAdminResourceStore = create<AdminResourceStoreState>()(
  persist((set, get) => ({
    data: initialState,
    getData: () => get().data,
    setData: (data: AdminResourceStore) => set({ data }),
    resetData: () => set({ data: initialState })
  }), {
    name: 'admin-resource-store',
  })
)