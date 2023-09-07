import connectDB from "@/app/lib/mongodb"
import { GetServerSideProps } from "next";
import postureData from "@/interfaces/postureData";
import PostureSearch from "../../components/PosturesSearch";
import PostureSchema from "../models/PostureSchema";
import mongoose from "mongoose";

export async function getServerSideProps(): Promise<GetServerSideProps<{ postureProps: postureData[] }>> {

    let postureProps: postureData[] = [];
    let data;
    
    try {
        await connectDB();
       
    } catch (error) {
        
        console.log('DB Connection failed', error);
        
    }

    // try {
    //   const response = await fetch('https://www.pocketyoga.com/poses.json');

    //   if (!response.ok) throw new Error("Error fetching data");

    // postureProps = await response.json();
    // // console.error("postureProps:", postureProps);

    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }

    // console.log(`getStaticProps fetched ${postureProps.length} postures`);

    return { props: { postureProps } }

};

export default function page(props: { postureProps: postureData[] }) {
    getServerSideProps();

    return (
        <>
            <h1>Asana Postures</h1>
            {/* <PostureSearch postures={props.postureProps} /> */}
        </>
    )
}