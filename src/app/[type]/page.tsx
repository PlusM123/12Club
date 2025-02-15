import React from 'react'
import { ExpandableCard } from '@/components/ui/expandable-card'
import { FocusCards } from '@/components/ui/focus-cards'

export default function Novel({
  params
}: {
  params: { type: 'comic' | 'novel' }
}) {
  const { type } = params
  const typeMap = {
    comic: '漫画',
    novel: '小说'
  }
  const cards = [
    {
      quote: `敗女的精髓藏於短篇故事中── 
數量龐大的特典短篇、活動短篇以及豐橋綜合動植物公園合作短篇等，一共收錄四十篇以上！
另外還有她們的生日等詳細個人資料……？ 
欲熟知本作不可或缺，敗北女角們的幕間短短短篇集！ 
            `,
      title: '敗北女角太多了！ SSS',
      author: '雨森焚火',
      src: '/novel/1.jpg',
      ctaLink: '/novel/1'
    },
    {
      quote: `某一天傍晚。 
我和容貌動人如精靈，金髮碧眼美少女在同一間房間獨處。 
我和她都穿著寬鬆的睡衣。 
我們坐在同一張床上，她背對著我。 
可能因為緊張的關係，我感覺自己表情緊繃。 
`,
      title:
        '你不敢吻我對吧？」自大的青梅竹馬挑釁我，結果她比我想像中更容易害羞',
      author: '樱木樱',
      src: '/novel/2.jpg',
      ctaLink: '/novel/2'
    },
    {
      quote: `教室裡瀰漫著初夏的氣息。 
燦爛的陽光照耀學校室內及室外，即使開了空調，教室窗邊陽光直射的位置還是很熱。 
學生們穿著短袖制服，卻依然可見他們熱得手臂上都冒汗了。 
同時，在靠近窗邊的座位上，一名少年撐著身子越過桌子，以不輸給氣溫的氣勢滔滔不絕： 
「光太郎，在幾經波折下，學校認證的交友軟體正如火如荼開發中。」 
「沒人問你這件事的進展啊……二郎。」 `,
      title:
        '我和隔壁班美少女共度甜蜜校園生活，但事到如今實在無法承認當初搞錯了告白對象',
      author: 'サトウとシオ',
      src: '/novel/3.jpg',
      ctaLink: '/novel/3'
    },
    {
      quote: `萊特等人的下一個復仇目標是矮人族的納諾。為了打倒他，萊特向矮人王國尋求合作，矮人國王達干則提出要求，希望他們攻略太古時代滅亡的『過去文明』遺跡。 
萊特等人踏入藏有「主宰」之謎的遺跡，而遺跡的最深處，竟是「神話級」兵器橫行的其他世界。萊特等人以在其他世界的調查結果作為籌碼與矮人國王談判，著手計畫討伐以人族進行殘忍研究的納諾── 
最強『扭蛋』奇幻故事，接近了世界的初始與終焉的第五集！！`,
      title:
        '差點在迷宮深處被信任的夥伴殺掉，但靠著天賜技能「無限扭蛋」獲得等級9999的夥伴，我要向前隊友和世界展開復仇＆「給他們好看！」',
      author: '明鏡シスイ',
      src: '/novel/4.jpg',
      ctaLink: '/novel/4'
    }
  ]
  return (
    <div className="max-h-[80vh]">
      <h1 className="text-xl font-bold py-4">热门{typeMap[type]}</h1>
      <ExpandableCard cards={cards} />
      <h1 className="text-xl font-bold py-4">更多推荐{typeMap[type]}</h1>
      <FocusCards cards={[...cards, ...cards, ...cards]} />
    </div>
  )
}
