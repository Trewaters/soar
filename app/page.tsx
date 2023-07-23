import MenuMain from './component/MenuMain'
import MenuPlanner from './component/MenuPlanner'
import PostureSearch from '../pages/components/PosturesSearch'
import PostureCard from '@/pages/components/PostureCard'



export default function Home() {

  return (
    <>
    <h1>Soar, Eight Limbs of Yoga</h1>
    <MenuMain />
    <MenuPlanner />
    <PostureSearch />
    <PostureCard />   
    <p>Landing Page</p>
    </>
  )
}
