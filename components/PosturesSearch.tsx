'use client'
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/interfaces/postureData";
import PostureCard from "./PostureCard";

export default function PostureSearch(props: { postures: postureData[] }) {
  
  const [postures, setPostures] = useState<postureData[]>(props.postures);
  const [cardPosture, setcardPosture] = useState<string>();
    
  const selectedPosture: postureData | undefined = postures?.find(p => p.english === cardPosture);

    return (
      <>    
      
         <Autocomplete
           id="search-poses"
           options={postures?.map((posture: postureData) => posture.english)}  // Use optional chaining here
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
           defaultValue={'Awkward'}
           autoSelect={true}
           onChange={(event, value: String) => setcardPosture(value as string)}
         />
        
      <h2>Posture Card</h2>
      {selectedPosture && (
        <PostureCard
        postureCardProp={selectedPosture}
         />
      )}
      </>
    )
}