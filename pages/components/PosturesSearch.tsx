'use client'
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import postureData from "@/app/interfaces/postureData";

export default function PostureSearch(props: postureData[]) {
   
    const [postures, setPostures] = useState<postureData[]>([...props.posturePropData]);


    return (
         <Stack spacing={2} sx={{ background: "white" }}>
         <Autocomplete
           id="search-poses"
           options={postures.map((posture: postureData) => posture.display_name)}
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
           defaultValue={'Mountain Pose'}
           autoSelect={true}
           onChange={(event, value) => console.log(value)}
         />
         <Autocomplete
           id="free-solo-2-demo"
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
    )
}