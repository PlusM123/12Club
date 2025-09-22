import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SortField, SortOrder } from '@/components/pageContainer/_sort'

export interface CreateSearchData {
  searchHistory: string[]
  searchInIntroduction: boolean
  searchInAlias: boolean
  searchInAnime: boolean
  searchInComic: boolean
  searchInGame: boolean
  searchInNovel: boolean
  selectedType: string
  sortField: SortField
  sortOrder: SortOrder
  selectedLanguage: string
}

const initialState: CreateSearchData = {
  searchHistory: [],
  searchInIntroduction: true,
  searchInAlias: true,
  searchInAnime: true,
  searchInComic: true,
  searchInGame: true,
  searchInNovel: true,
  selectedType: 'all',
  sortField: 'updated',
  sortOrder: 'desc',
  selectedLanguage: 'all'
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
