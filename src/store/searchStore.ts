import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CreateSearchData {
  searchHistory: string[]
  searchInIntroduction: boolean
  searchInAlias: boolean
  searchInAnime: boolean
  searchInComic: boolean
  searchInGame: boolean
  searchInNovel: boolean
}

const initialState: CreateSearchData = {
  searchHistory: [],
  searchInIntroduction: false,
  searchInAlias: true,
  searchInAnime: true,
  searchInComic: true,
  searchInGame: true,
  searchInNovel: true
}

interface SearchStoreState {
  data: CreateSearchData
  getData: () => CreateSearchData
  setData: (data: CreateSearchData) => void
  resetData: () => void
}

export const useSearchStore = create<SearchStoreState>()(
  persist(
    (set, get) => ({
      data: initialState,
      getData: () => get().data,
      setData: (data: CreateSearchData) => set({ data }),
      resetData: () => set({ data: initialState })
    }),
    {
      name: 'search-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
