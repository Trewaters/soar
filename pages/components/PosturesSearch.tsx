'use client'
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/app/interfaces/postureData";
import PostureCard from "@components/PostureCard";

interface PostureSearchProps{
  posturePropData: postureData[];
}

export default function PostureSearch({ posturePropData }: PostureSearchProps) {
   
    const [postures, setPostures] = useState<postureData[]>(posturePropData);
    const [cardPosture, setcardPosture] = useState<string | null>();

    // Find the selected posture based on the Autocomplete selection
    const selectedPosture = postures?.find(p => p.display_name === cardPosture) || null;

    return (
      <>    
         <Stack spacing={2} sx={{ background: "white" }}>
         <Autocomplete
           id="search-poses"
           options={postures?.map((posture: postureData) => posture.display_name)}
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
           defaultValue={'Awkward'}
           autoSelect={true}
          onChange={(event, value: string | null) => setcardPosture(value || '')}
         />
         <Autocomplete
           id="search-categories"
           disableClearable
           options={postures?.map((posture: postureData) => posture.category)}
           renderInput={(params) => (
             <TextField
               {...params}
               label="Yoga Categories"
               InputProps={{
                 ...params.InputProps,
                 type: 'search',
               }}
             />
           )}
         />
       </Stack>
        
      <h2>Posture Card</h2>
      {selectedPosture && (
        <PostureCard
        postureCardProp={selectedPosture}
         />
      )}

      </>
    )
}