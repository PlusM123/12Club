import { imageList } from '@/constants/image'
import Carousel from '@/components/ui/carousel'
export default function Home() {
  const slideData = [
    {
      title: '我独自升级',
      imageSrc: imageList[0]
    },
    {
      title: '中年大叔转生反派千金',
      imageSrc: imageList[10]
    },
    {
      title: '全修',
      imageSrc: imageList[2]
    },
    {
      title: '颂乐人偶',
      imageSrc: imageList[3]
    },
    {
      title: '我独自升级',
      imageSrc: imageList[0]
    }
  ]
  return (
    <div
      className={`
        w-screen h-fit overflow-hidden pt-3 -mx-3 sm:-mx-6
        flex flex-col justify-center items-center
      `}
    >
      <Carousel slides={slideData} />
      <div className="divder 2xl:hidden w-full h-[60px]" />
    </div>
  )
}
