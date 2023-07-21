import MenuMain from './component/MenuMain'
import MenuPlanner from './component/MenuPlanner'
import PostureSearch from '../pages/components/PosturesSearch'
import PostureCard from '@/pages/components/PostureCard'



export default function Home() {

  return (
    <>
    <MenuMain />
    <MenuPlanner />
    <PostureSearch />
    <PostureCard />   
    </>
  )
}
