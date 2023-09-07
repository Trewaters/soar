// import { Schema } from 'mongoose';

// const PostureSchema = new Schema({
//     nameEnglish: {
//         type: String,
//         required: true,
//     },
//     nameSanskrit: String,
//     description: String,
//     image: String,
//     video: String,
//     category: String,
//     difficulty: String,
//     modifications: String,
// });

// export default PostureSchema;

import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  latin: String,
  devanagari: String,
  simplified: String,
  description: String
});

const sanskritNameSchema = new mongoose.Schema({
  latin: String,
  devanagari: String,
  simplified: String,
  translation: [translationSchema]
});

const poseSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  aka: [String],
  benefits: String,
  category: String,
  description: String,
  difficulty: String,
  display_name: String,
  name: String,
  next_poses: [String],
  preferred_side: String,
  previous_poses: [String],
  sanskrit_names: [sanskritNameSchema],
  sideways: Boolean,
  sort_name: String,
  subcategory: String,
  two_sided: Boolean,
  variations: String,  // Assuming a string but can be updated based on requirements
  visibility: String
});

const Pose = mongoose.model('Pose', poseSchema);

export default Pose;
