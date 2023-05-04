import mongoose from "mongoose";

const companiesSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: String,
  name: String,
  user: String,
  position: String,
  linkedin: String,
  website: String,
  description: String,
  jobcategories: [
    {
      category: String,
      jobs: [
        {
          name: String,
          location: String,
          date: Date,
          schoolminimum: Number,
          schoolrecommended: Number,
          schoolweightage: Number,
          highestdegrees: [String],
          minimumcgpa: Number,
          recommendedcgpa: Number,
          cgpaweightage: Number,
          minimumexperience: Number,
          recommendedexperience: Number,
          experienceweightage: Number,
          skills: [{ skill: String, level: Number, weightage: Number }],
          minepsevents: Number,
          recepsevents: Number,
          epseventsweightage: Number,
          minpapersq1: Number,
          recpapersq1: Number,
          q1weightage: Number,
          minpapersq2: Number,
          recpapersq2: Number,
          q2weightage: Number,
          minpapersq3: Number,
          recpapersq3: Number,
          q3weightage: Number,
          minpapersq4: Number,
          recpapersq4: Number,
          q4weightage: Number,
          otherrequirements: String,
          goodresumetips: String,
        },
      ],
    },
  ],
});

export default mongoose.model("companies", companiesSchema);
