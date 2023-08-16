import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/interfaces/postureData";
import PostureCard from "./PostureCard";

// interface PostureSearchProps{
//   posturePropData: postureData[];
// }


export default function PostureSearch(props: {posturePropData: postureData[]}) {
    
  
  console.log(`Object.keys(posturePropData) ${Object.keys(props.posturePropData)}`)

  const [postures, setPostures] = useState<postureData[]>();
    const [cardPosture, setcardPosture] = useState<string>();


  const selectedPosture: postureData | undefined = postures?.find(p => p.display_name === cardPosture);

    return (
      <>    
         <Stack spacing={2} sx={{ background: "white" }}>
         <Autocomplete
           id="search-poses"
           options={postures?.map((posture: postureData) => posture.display_name)}  // Use optional chaining here
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
           defaultValue={'Awkward'}
           autoSelect={true}
           onChange={(event, value: String) => setcardPosture(value as string)}
         />
         <Autocomplete
           id="search-categories"
           disableClearable
           options={postures?.map((posture: postureData) => posture.category)}  // Use optional chaining here
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