const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    hobbies: {
        type: [String],
        required: true,
    },
    interest: {
        type: [String],
        required: true,
    },
    smokingHabits: {
        type: String,
        required: true,
    },
    drinkingHabits: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    profile_image_urls: {
        type: [String],
        required: true
    },
    profile_video_urls: {
        type: String,
    },
    bio: { type: String },
    gender: { type: String, required: false },
    location: {
        type: {
            lat: { type: Number },
            lon: { type: Number },
            name: { type: String }
        },
        required: false
    },
    // Extended fields for compatibility scoring
    lifestyle: {
        exercise: {
            type: String,
            enum: ['daily', '3-4_times_week', 'weekly', 'rarely', 'never', 'prefer_not_to_say'],
            default: 'prefer_not_to_say'
        },
        diet: {
            type: String,
            enum: ['none', 'vegetarian', 'vegan', 'keto', 'paleo', 'halal', 'kosher', 'other', 'prefer_not_to_say'],
            default: 'none'
        },
        marijuana: {
            type: String,
            enum: ['never', 'sometimes', 'regularly', 'prefer_not_to_say'],
            default: 'prefer_not_to_say'
        }
    },
    personality: {
        mbti: {
            type: String,
            enum: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                   'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP', null],
            default: null
        },
        loveLanguage: {
            type: String,
            enum: ['words_of_affirmation', 'physical_touch', 'quality_time',
                   'acts_of_service', 'receiving_gifts', null],
            default: null
        },
        socialEnergy: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        communicationStyle: {
            type: String,
            enum: ['frequent_texter', 'phone_calls', 'video_chats', 'in_person', null],
            default: null
        }
    },
    values: {
        religion: {
            name: {
                type: String,
                enum: ['christianity', 'islam', 'hinduism', 'buddhism', 'judaism',
                       'sikhism', 'atheist', 'agnostic', 'spiritual', 'other', null],
                default: null
            },
            importance: {
                type: String,
                enum: ['very_important', 'somewhat_important', 'not_important'],
                default: 'not_important'
            }
        },
        politics: {
            view: {
                type: String,
                enum: ['liberal', 'moderate', 'conservative', 'apolitical', 'other', null],
                default: null
            },
            importance: {
                type: String,
                enum: ['very_important', 'somewhat_important', 'not_important'],
                default: 'not_important'
            }
        },
        familyPlans: {
            type: String,
            enum: ['want_children', 'dont_want_children', 'have_children',
                   'open_to_children', 'not_sure', null],
            default: null
        },
        environmentalism: {
            type: String,
            enum: ['very_important', 'somewhat_important', 'not_important'],
            default: 'not_important'
        }
    },
    practical: {
        pets: [{
            type: String,
            enum: ['has_dogs', 'has_cats', 'has_birds', 'has_reptiles', 'has_fish',
                   'has_other', 'no_pets', 'wants_pets']
        }],
        jobType: {
            type: String,
            enum: ['full_time', 'part_time', 'freelance', 'student',
                   'entrepreneur', 'retired', 'unemployed', null],
            default: null
        },
        industry: {
            type: String,
            default: null
        },
        education: {
            type: String,
            enum: ['high_school', 'some_college', 'bachelors', 'masters', 'phd', null],
            default: null
        },
        languages: [{
            type: String
        }],
        vaccinated: {
            type: String,
            enum: ['yes', 'no', 'prefer_not_to_say'],
            default: 'prefer_not_to_say'
        }
    }
});

module.exports = mongoose.model('Profile', profileSchema);