const SpamReputation = require('./backend/models/SpamReputation');

/**
 * Advanced AI-Heuristic Spam Judgment Engine
 * Analyzes reputation, behavior, and patterns.
 */

async function calculateSpamScore(data) {
    const { patientPhone, patientDept, isEmergency, behaviorData } = data;
    let score = 70; // Baseline
    let reasons = [];

    // 1. Reputation Check (DB Persistent)
    let reputation = await SpamReputation.findOne({ phoneNumber: patientPhone });
    if (!reputation) {
        reputation = new SpamReputation({ phoneNumber: patientPhone });
    }

    if (reputation.isBanned) {
        return { score: 0, isSpam: true, reason: "Phone number is blacklisted by administrator." };
    }

    // Adjust based on historical trust
    score += (reputation.trustScore - 70); 

    // 2. Urgency Bonus
    if (isEmergency || patientDept === 'EMERGENCY') {
        score += 80; // Significant boost for emergencies
        reasons.push("Emergency Priority");
    }

    // 3. Behavioral Analysis (Frontend Data)
    if (behaviorData) {
        // Example: Rapid clicks detection
        if (behaviorData.clickSpeed > 10) { // increased threshold from 5 to 10
            score -= 30; // reduced penalty from 60 to 30
            reasons.push("Rapid interaction detected");
        }
        if (behaviorData.isAutomated) {
            score -= 50; // reduced penalty from 100 to 50
            reasons.push("Automated script suspected");
        }
    }

    // 4. Frequency Check
    const now = new Date();
    const timeDiff = now - reputation.lastRequestDate;
    if (timeDiff < 30000) { // Less than 30 seconds since last request
        reputation.spamCount += 1;
        score -= 30;
        reasons.push("High-frequency request pattern");
    }

    // 5. Pattern Recognition
    if (data.patientName && data.patientName.toLowerCase() === data.patientPhone) {
        score -= 50;
        reasons.push("Suspicious identity formatting");
    }

    // Clamp and Finalize
    score = Math.max(0, Math.min(100, score));
    const isSpam = score <= 30;

    // Update reputation in background (don't wait)
    reputation.totalRequests += 1;
    reputation.lastRequestDate = now;
    reputation.trustScore = Math.round((reputation.trustScore * 0.8) + (score * 0.2)); // Moving average
    reputation.save().catch(err => console.error('Reputation save failed:', err));

    return {
        score,
        isSpam,
        reason: isSpam ? reasons.join(", ") : "Verified",
        analysis: reasons
    };
}

module.exports = { calculateSpamScore };
