import connectDB from "@/app/lib/mongodb"
import PostureSchema from "@/app/models/PostureSchema";
import mongoose from "mongoose";
import error from "next/error";
import { NextResponse } from "next/server";
import { GetStaticProps } from "next";
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

export async function POST(req){
    const {introPose, focusPose, outroPose} = await req.json();
    // console.log('introPose', introPose);
    // console.log('focusPose', focusPose);
    // console.log('outroPose', outroPose);
    
    try {
        await connectDB();
        console.log('DB Connected successfully');
        await PostureSchema.create({introPose, focusPose, outroPose})
        return NextResponse.json({msg: 'ok'});
    } catch(err) {

     if(error instanceof mongoose.Error.ValidationError){
        let errorList = [];
        for (let e in error.errors){
            errorList.push(error.errors[e].message);
        }

        return NextResponse.json({msg: errorList});
    }else{
        return NextResponse.json({msg: 'error'});
    }
}
}