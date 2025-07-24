import { motion } from 'framer-motion'
import Image from 'next/image'

interface FullScreenProps {
  isFullScreen: boolean
  songCover: string
  songName: string
  authorName: string
}

const FullScreen: React.FC<FullScreenProps> = ({
  isFullScreen,
  songCover,
  songName,
  authorName
}) => {
  return (
    <motion.div
      className="absolute inset-0 z-10 pt-12 backdrop-blur-md flex justify-center items-center"
      initial={{ y: '100%' }}
      animate={{ y: isFullScreen ? '0%' : '100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-row mx-auto my-auto gap-10">
        <div className="w-96">
          <Image
            src={songCover}
            loading="eager"
            width={500}
            height={500}
            className=" rounded-xl"
            alt="Song Cover"
          />
          <div className="w-full mt-4">
            <p className="truncate text-3xl font-black">{songName}</p>
            <p className="truncate text-sm">{authorName}</p>
          </div>
        </div>
        <div className="w-96 items-stretch">111</div>
      </div>
    </motion.div>
  )
}

export default FullScreen
