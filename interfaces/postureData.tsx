// for postures.json data
interface postureData {
    breath: string;
    english: string;
    sanskrit: string;
    sanskritSound: string;
    cueSetup: string;
    cueBasic: string;
    cueTransition: string;
    cueDeepen: string;
    cueMuscleAction: string;
    series: string []
    image: string;
    ABCs: string;
    description: string;
    meaning: string;
    isCompleted: boolean;
    duration: string;
    intention: string;
    dristi: string;
    personalization: string;
    benefits: string;
    action: JointAction;

    // aka: string[];
    // benefits: string;
    // category: string;
    // description: string;
    // difficulty: string;
    // display_name: string;
    // name: string;
    // next_poses: string[];
    // preferred_side: string;
    // previous_poses: string[];
    // sanskrit_names: {
    //     latin: string;
    //     devanagari: string;
    //     simplified: string;
    //     translation: {
    //         latin: string;
    //         devanagari: string;
    //         simplified: string;
    //         description: string;
    //     }[];
    // }[];
    // sideways: boolean;
    // sort_name: string;
    // subcategory: string;
    // two_sided: boolean;
    // variations: null | any; // Replace 'any' with an appropriate type if possible
    // visibility: string;
}

interface JointAction {
    feet: string;
    legs: string;
    pelvis: string;
    spine: string;
    arms: string;
    head: string;
    neck: string;
    lengthen: string;
    strengthen: string;
}

export default postureData;
