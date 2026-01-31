const User = require('../Models/User');
const ProfileDetails = require('../Models/ProfileDetails');

class CompatibilityEngine {
    /**
     * Main entry point: Calculate compatibility score between two users
     * @param {Object} user1 - First user with populated profile
     * @param {Object} user2 - Second user with populated profile
     * @returns {Object} - { score: Number, breakdown: Array }
     */
    calculateScore(user1, user2) {
        const profile1 = user1.profile || user1;
        const profile2 = user2.profile || user2;

        // Calculate individual factor scores
        const factors = {
            interests: this.compareInterests(profile1.interest || [], profile2.interest || []) * 0.25,
            goals: this.compareGoals(user1.relationShipGoal, user2.relationShipGoal) * 0.20,
            lifestyle: this.compareLifestyle(profile1, profile2) * 0.15,
            values: this.compareValues(profile1.values, profile2.values) * 0.15,
            location: this.calculateLocationScore(profile1.location, profile2.location) * 0.10,
            education: this.compareEducation(profile1.education || profile1.qualification, profile2.education || profile2.qualification) * 0.05,
            activity: this.analyzeActivityPatterns(profile1, profile2) * 0.10
        };

        // Total score (0-100)
        const totalScore = Math.round(Object.values(factors).reduce((a, b) => a + b, 0));

        // Breakdown for UI display
        const breakdown = [
            { name: 'Shared Interests', score: Math.round(factors.interests * 4), icon: '🎯' },
            { name: 'Relationship Goals', score: Math.round(factors.goals * 5), icon: '💕' },
            { name: 'Lifestyle Match', score: Math.round(factors.lifestyle * 6.67), icon: '🏃' },
            { name: 'Core Values', score: Math.round(factors.values * 6.67), icon: '⭐' },
            { name: 'Location', score: Math.round(factors.location * 10), icon: '📍' },
            { name: 'Education', score: Math.round(factors.education * 20), icon: '🎓' },
            { name: 'Activity Sync', score: Math.round(factors.activity * 10), icon: '⏰' }
        ];

        return {
            score: totalScore,
            breakdown
        };
    }

    /**
     * Compare interests using Jaccard similarity
     * @returns {Number} - Score 0-100
     */
    compareInterests(interests1, interests2) {
        if (!interests1?.length || !interests2?.length) return 0;

        const set1 = new Set(interests1.map(i => i.toLowerCase()));
        const set2 = new Set(interests2.map(i => i.toLowerCase()));

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return (intersection.size / union.size) * 100;
    }

    /**
     * Compare relationship goals
     * @returns {Number} - Score 0-100
     */
    compareGoals(goals1, goals2) {
        if (!goals1 || !goals2) return 50; // neutral if missing

        const goal1 = goals1.toLowerCase();
        const goal2 = goals2.toLowerCase();

        // Exact match = 100
        if (goal1 === goal2) return 100;

        // Compatibility mapping
        const compatibilityMap = {
            'longterm': ['longterm', 'long-term', 'marriage'],
            'long-term': ['longterm', 'long-term', 'marriage'],
            'marriage': ['longterm', 'long-term', 'marriage'],
            'shortterm': ['shortterm', 'short-term', 'casual', 'friends'],
            'short-term': ['shortterm', 'short-term', 'casual', 'friends'],
            'casual': ['shortterm', 'short-term', 'casual', 'friends'],
            'friends': ['shortterm', 'short-term', 'casual', 'friends']
        };

        const compatible = compatibilityMap[goal1]?.includes(goal2);
        return compatible ? 70 : 20; // Compatible = 70, Incompatible = 20
    }

    /**
     * Compare lifestyle factors
     * @returns {Number} - Score 0-100
     */
    compareLifestyle(profile1, profile2) {
        if (!profile1 || !profile2) return 50;

        let score = 0;
        let factorsCompared = 0;

        // Smoking habits
        if (profile1.smokingHabits && profile2.smokingHabits) {
            factorsCompared++;
            if (profile1.smokingHabits.toLowerCase() === profile2.smokingHabits.toLowerCase()) {
                score += 25;
            } else if (this.isLifestyleCompatible('smoking', profile1.smokingHabits, profile2.smokingHabits)) {
                score += 15;
            }
        }

        // Drinking habits
        if (profile1.drinkingHabits && profile2.drinkingHabits) {
            factorsCompared++;
            if (profile1.drinkingHabits.toLowerCase() === profile2.drinkingHabits.toLowerCase()) {
                score += 25;
            } else if (this.isLifestyleCompatible('drinking', profile1.drinkingHabits, profile2.drinkingHabits)) {
                score += 15;
            }
        }

        // Exercise (from lifestyle object)
        if (profile1.lifestyle?.exercise && profile2.lifestyle?.exercise) {
            factorsCompared++;
            if (profile1.lifestyle.exercise === profile2.lifestyle.exercise) {
                score += 25;
            } else if (this.isLifestyleCompatible('exercise', profile1.lifestyle.exercise, profile2.lifestyle.exercise)) {
                score += 15;
            }
        }

        // Diet preferences
        if (profile1.lifestyle?.diet && profile2.lifestyle?.diet) {
            factorsCompared++;
            if (profile1.lifestyle.diet === profile2.lifestyle.diet) {
                score += 25;
            } else if (profile1.lifestyle.diet === 'none' || profile2.lifestyle.diet === 'none') {
                score += 20; // No preference is moderately compatible
            }
        }

        return factorsCompared > 0 ? Math.round(score / factorsCompared) : 50;
    }

    /**
     * Check if two lifestyle preferences are compatible
     */
    isLifestyleCompatible(factor, value1, value2) {
        const v1 = value1.toLowerCase();
        const v2 = value2.toLowerCase();

        const compatiblePairs = {
            smoking: [
                ['no', 'never'],
                ['sometimes', 'rarely'],
                ['socially', 'sometimes']
            ],
            drinking: [
                ['no', 'never'],
                ['socially', 'sometimes'],
                ['regularly', 'socially']
            ],
            exercise: [
                ['daily', '3-4_times_week'],
                ['3-4_times_week', 'weekly'],
                ['rarely', 'never']
            ]
        };

        return compatiblePairs[factor]?.some(pair =>
            (pair.includes(v1) && pair.includes(v2))
        ) || false;
    }

    /**
     * Compare core values with importance weighting
     * @returns {Number} - Score 0-100
     */
    compareValues(values1, values2) {
        if (!values1 || !values2) return 50;

        let score = 0;

        // Religion (weighted by importance)
        if (values1.religion && values2.religion) {
            if (values1.religion.name === values2.religion.name) {
                score += 50; // Same religion = high compatibility
            } else {
                const bothNotImportant =
                    values1.religion.importance === 'not_important' &&
                    values2.religion.importance === 'not_important';
                score += bothNotImportant ? 30 : 10;
            }
        } else {
            score += 25; // Neutral if missing
        }

        // Politics (weighted by importance)
        if (values1.politics && values2.politics) {
            if (values1.politics.view === values2.politics.view) {
                score += 25; // Same views = compatible
            } else {
                const bothNotImportant =
                    values1.politics.importance === 'not_important' &&
                    values2.politics.importance === 'not_important';
                score += bothNotImportant ? 15 : 5;
            }
        } else {
            score += 12; // Neutral if missing
        }

        // Family plans (very important for long-term compatibility)
        if (values1.familyPlans && values2.familyPlans) {
            if (values1.familyPlans === values2.familyPlans) {
                score += 25; // Same plans = perfect match
            } else if (
                values1.familyPlans === 'open_to_children' ||
                values2.familyPlans === 'open_to_children' ||
                values1.familyPlans === 'not_sure' ||
                values2.familyPlans === 'not_sure'
            ) {
                score += 15; // Flexible = moderately compatible
            } else {
                score += 5; // Different plans = low compatibility
            }
        } else {
            score += 13; // Neutral if missing
        }

        return Math.min(score, 100);
    }

    /**
     * Calculate location-based score using Haversine formula
     * @returns {Number} - Score 0-100
     */
    calculateLocationScore(loc1, loc2) {
        if (!loc1?.lat || !loc1?.lon || !loc2?.lat || !loc2?.lon) return 0;

        const distance = this.getDistance(loc1.lat, loc1.lon, loc2.lat, loc2.lon);

        // Score inversely proportional to distance (in km)
        if (distance < 10) return 100;  // < 10km = perfect
        if (distance < 25) return 80;   // < 25km = excellent
        if (distance < 50) return 60;   // < 50km = good
        if (distance < 100) return 40;  // < 100km = moderate
        if (distance < 200) return 20;  // < 200km = low
        return 10;                      // > 200km = very low
    }

    /**
     * Haversine formula to calculate distance between two coordinates
     * @returns {Number} - Distance in kilometers
     */
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    /**
     * Convert degrees to radians
     */
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Compare education levels
     * @returns {Number} - Score 0-100
     */
    compareEducation(edu1, edu2) {
        if (!edu1 || !edu2) return 50; // Neutral if missing

        const educationLevels = {
            'high_school': 1,
            'some_college': 2,
            'bachelors': 3,
            'bachelor': 3,
            'masters': 4,
            'master': 4,
            'phd': 5,
            'doctorate': 5
        };

        const level1 = educationLevels[edu1.toLowerCase()] || 3;
        const level2 = educationLevels[edu2.toLowerCase()] || 3;

        const difference = Math.abs(level1 - level2);

        // Same level = 100, 1 level apart = 80, 2+ levels = 60
        if (difference === 0) return 100;
        if (difference === 1) return 80;
        return 60;
    }

    /**
     * Analyze activity patterns (hobbies, social energy)
     * @returns {Number} - Score 0-100
     */
    analyzeActivityPatterns(profile1, profile2) {
        let score = 0;

        // Compare hobbies
        if (profile1.hobbies?.length && profile2.hobbies?.length) {
            const hobbyScore = this.compareInterests(profile1.hobbies, profile2.hobbies);
            score += hobbyScore * 0.5;
        } else {
            score += 25; // Neutral
        }

        // Compare social energy levels
        if (profile1.personality?.socialEnergy && profile2.personality?.socialEnergy) {
            const energyDiff = Math.abs(profile1.personality.socialEnergy - profile2.personality.socialEnergy);
            const energyScore = Math.max(0, 100 - (energyDiff * 10)); // 10 points penalty per level difference
            score += energyScore * 0.5;
        } else {
            score += 25; // Neutral
        }

        return Math.min(score, 100);
    }
}

module.exports = new CompatibilityEngine();
