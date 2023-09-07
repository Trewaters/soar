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
