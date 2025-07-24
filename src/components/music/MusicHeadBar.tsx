'use client'
import { PlaceholdersAndVanishInput } from '../ui/PlaceholderInput'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface HeadbarProps {
  placeholders: string[]
}

const Headbar: React.FC<HeadbarProps> = ({ placeholders }) => {
  const [inputText, setInputText] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submitted', inputText)
  }
  return (
    <div
      className={cn(`
        w-full h-12
        absolute top-0 left-0 right-0  px-4
        flex justify-between items-center
        `)}
    >
      <p></p>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default Headbar
