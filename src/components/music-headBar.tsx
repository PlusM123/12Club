import { twMerge } from 'tailwind-merge';

const Headbar = () => {
  return (
    <div
      className={twMerge(`
        w-full h-12 
        absolute top-0 left-0 right-0 
        backdrop-blur-md 
        flex justify-between items-center 
        px-8
        `)}
    >
      <p>search</p>
      <input />
    </div>
  );
};

export default Headbar;
