'use client'
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';



export default  function PostureSearch() {
    /* 
    interface Posture {
        title: string;
        image: string;
        nameEnglish: string;
        nameSanskrit: string;
        pronunciation: string;
        duration: string;
        description: string;
        meaning: string;
        intent: string;
        isCompleted: boolean;
        dristi: string;
        breath: string;
    }
 */

    // for postures.json data
    interface ArcherPose {
        aka: string[];
        benefits: string;
        category: string;
        description: string;
        difficulty: string;
        display_name: string;
        name: string;
        next_poses: string[];
        preferred_side: string;
        previous_poses: string[];
        sanskrit_names: {
            latin: string;
            devanagari: string;
            simplified: string;
            translation: {
                latin: string;
                devanagari: string;
                simplified: string;
                description: string;
            }[];
        }[];
        sideways: boolean;
        sort_name: string;
        subcategory: string;
        two_sided: boolean;
        variations: null | any; // Replace 'any' with an appropriate type if possible
        visibility: string;
    }
    
    const [postures, setPostures] = useState<ArcherPose[]>([]);

    return (
         <Stack spacing={2} sx={{ background: "white" }}>
         <Autocomplete
           id="free-solo-demo"
           postures
           options={postures.map((posture) => posture.display_name)}
           renderInput={(params) => <TextField {...params} label="Yoga Postures" />}
         />
         <Autocomplete
           postures
           id="free-solo-2-demo"
           disableClearable
           options={postures.map((posture) => posture.category)}
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