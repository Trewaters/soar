import { GetStaticProps } from "next";
import PostureSearch from "../components/PosturesSearch";
import postureData from "@/interfaces/postureData";

export function getStaticProps(): GetStaticProps<{postureProps: postureData[]}> {
    
    let postureProps: postureData[] = [];
    let data;
  
    try {
      const response = fetch('https://www.pocketyoga.com/poses.json');
  
    //   if (!response.ok) throw new Error("Error fetching data");
  
      data = response.then((res) => res.json());
  
    //   console.log(`Fetched ${postureProps.length} postures`);
      console.log(`Fetched data ${data} postures`);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    console.log(`getStaticProps fetched ${postureProps.length} postures`);
  
    return {props: postureProps}
  
  };
  
export default function asanaPostures(props: {postureProps: postureData[]}) {
    
    return (
        <>
            <h1>Asana Postures</h1>
            <PostureSearch posturePropData={props.postureProps}/>
        </>
    );
}
