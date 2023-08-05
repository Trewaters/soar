import Link from 'next/link';
// import postureData from "@/interfaces/postureData";
// import PostureSearch from "./components/PosturesSearch";


/* async function getData() {
    const res = await fetch('https://www.pocketyoga.com/poses.json')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
  
    const postureProps = await res.json();
  
    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
  
    // return res.json()
    return postureProps
  } */

export default async function AsanaPostures() {
    // const posturePropData: postureData[] = await getData()

    return (
        <>
            <h1>Asana Postures</h1>
            {/* <PostureSearch posturePropData={posturePropData} /> */}
        </>
    )
}