import connectDB from "@/app/lib/mongodb"
import PostureSchema from "@/app/models/PostureSchema";
import mongoose from "mongoose";
import error from "next/error";
import { NextResponse } from "next/server";

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