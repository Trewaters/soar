import { Schema } from 'mongoose';

const postureSchema = new Schema({
    nameEnglish: {
        type: String,
        required: true,
    },
    nameSanskrit: String,
    description: String,
    image: String,
    video: String,
    category: String,
    difficulty: String,
    modifications: String,
});