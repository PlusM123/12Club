'use client';
import { twMerge } from 'tailwind-merge';
import { PlaceholdersAndVanishInput } from '../components/ui/placeholder-input';
import { useState } from 'react';

interface HeadbarProps {
  placeholders: string[];
}

const Headbar: React.FC<HeadbarProps> = ({ placeholders }) => {
  const [inputText, setInputText] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submitted', inputText);
  };
  return (
    <div
      className={twMerge(`
        w-full h-12 z-40
        absolute top-0 left-0 right-0 
        backdrop-blur-md px-4
        flex justify-between items-center
        `)}
    >
      <p></p>
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
    </div>
  );
};

export default Headbar;
