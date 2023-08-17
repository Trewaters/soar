import { GetStaticProps } from "next";
import PostureSearch from "../components/PosturesSearch";
import postureData from "@/interfaces/postureData";

export async function getStaticProps(): GetStaticProps<{postureProps: postureData[]}> {
    
    let postureProps: postureData[] = [];
    let data;
  
    try {
      const response = await fetch('https://www.pocketyoga.com/poses.json');
  
    //   if (!response.ok) throw new Error("Error fetching data");
  
    // postureProps = await response.then((res) => res.json());
    postureProps = await response.json();

    console.log(`typeof postureProps, ${typeof postureProps}`);  // This will return "object" if it's an array
    console.log(Array.isArray(postureProps) ? "postureProps is an Array" : "postureProps is Not an Array");  // This will return "Array" if it's an array
    
    // console.log(`JSON.stringify(postureProps) ${JSON.stringify(postureProps)}`);
      // console.log(`Fetched ${postureProps.length} postures`);
      // console.log(`Fetched data ${data} postures`);
      
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
