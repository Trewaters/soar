import { GetStaticProps } from "next";
import PostureSearch from "../components/PosturesSearch";
import postureData from "@/interfaces/postureData";

export async function getStaticProps(): Promise<GetStaticProps<{ postureProps: postureData[] }>> {
    
    let postureProps: postureData[] = [];
    let data;
  
    try {
      const response = await fetch('https://www.pocketyoga.com/poses.json');
  
      if (!response.ok) throw new Error("Error fetching data");
  
    postureProps = await response.json();
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // console.log(`getStaticProps fetched ${postureProps.length} postures`);
  
    return {props: {postureProps: postureProps}}
  
  };
  
export default function asanaPostures(props: {postureProps: postureData[]}) {
    
    return (
        <>
            <h1>Asana Postures</h1>
            <PostureSearch postures={props.postureProps}/>
        </>
    );
}
