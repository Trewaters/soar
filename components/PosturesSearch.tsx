import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/interfaces/postureData";
import PostureCard from "./PostureCard";
// import { GetStaticProps } from "next";

// export async function getData() {
//   let postureProps: postureData[] = [];

//   try {
//     const response = await fetch('https://www.pocketyoga.com/poses.json');

//     // if (!response.ok) throw new Error("Error fetching data");

//     postureProps = await response.json();

//     // console.log("getData():", postureProps);  // Log data here

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return postureProps
//   }

//   // console.log(`getStaticProps fetched ${postureProps.length} postures`);

//   return postureProps

// };

// export async function getStaticProps(): GetStaticProps {
//   const response = await fetch(
//     "https://www.pocketyoga.com/poses.json"
//     ).then((response) => response.json());
      
    
//     console.log(`getApiData ${response}`);

//   return {
//     props: {
//       postures: response,
//     },
//   };
// }


export default function PostureSearch(props: { postures: postureData[] }) {
  
  const [postures, setPostures] = useState<postureData[]>(props.postures);
  const [cardPosture, setcardPosture] = useState<string>();
    
    
    // const fetchedPostures = await getData();
  //   useEffect(() => {
  //     (async () => {
  //         const fetchedPostures = await getData();
  //         console.log("Fetched postures:", fetchedPostures);  // Log data here
  //         setPostures(fetchedPostures);
  //     })();
  // }, []);

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