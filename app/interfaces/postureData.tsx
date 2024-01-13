// for postures.json data
interface postureData {
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

export default postureData;

/* 
    // Original interface for postureData
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
