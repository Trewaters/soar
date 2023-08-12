import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/interfaces/postureData";
import PostureCard from "./PostureCard";

// async function getData(): Promise<postureData[]> {
//     try {
//         const res = await fetch('https://www.pocketyoga.com/poses.json');
//         if (!res.ok) throw new Error("Error fetching data");
//         const postureProps: postureData[] = await res.json();
//         return postureProps;
//     } catch {
//         console.log("Error fetching data");
//         return [];
//     }
// }

export default function PostureSearch(props: {postureProps: postureData[]}) {
    const [postures, setPostures] = useState<postureData[]>(props.postureProps);
    const [cardPosture, setcardPosture] = useState<string>();

  //   useEffect(() => {
  //     (async () => {
  //         const fetchedPostures = await getData();
  //         console.log("Fetched postures:", fetchedPostures);  // Log data here
  //         setPostures(fetchedPostures);
  //     })();
  // }, []);
  

    if (postures){
      const selectedPosture: postureData | undefined = postures.find(p => p.display_name === cardPosture);
    };


    return (
      <>    
         <Stack spacing={2} sx={{ background: "white" }}>
         <Autocomplete
           id="search-poses"
           options={postures.map((posture: postureData) => posture.display_name)}
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
           defaultValue={'Awkward'}
           autoSelect={true}
           onChange={(event, value: String) => setcardPosture(value as string)}
         />
         <Autocomplete
           id="search-categories"
           disableClearable
           options={postures.map((posture: postureData) => posture.category)}
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