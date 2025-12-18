// config/referralConfig.js

/**
 * Referral Milestone Configuration
 * Define all referral milestones and their rewards here
 * This config is used across signup, referral tracking, and admin systems
 */

const REFERRAL_MILESTONES = [
  {
    count: 3,
    credits: 50,
    description: '3 referrals milestone',
    name: 'Bronze Milestone',
    icon: '🥉'
  },
  {
    count: 5,
    credits: 100,
    description: '5 referrals milestone',
    name: 'Silver Milestone',
    icon: '🥈'
  },
  {
    count: 10,
    credits: 200,
    description: '10 referrals milestone',
    name: 'Gold Milestone',
    icon: '🥇'
  },
  {
    count: 20,
    credits: 500,
    description: '20 referrals milestone',
    name: 'Diamond Milestone',
    icon: '💎'
  },
  {
    count: 50,
    credits: 1500,
    description: '50 referrals milestone',
    name: 'Platinum Milestone',
    icon: '👑'
  }
];

/**
 * Get milestone by referral count
 * @param {number} referralCount - Current number of referrals
 * @returns {object|null} - Milestone object if count matches, null otherwise
 */
const getMilestoneByCount = (referralCount) => {
  return REFERRAL_MILESTONES.find(m => m.count === referralCount) || null;
};

/**
 * Get next milestone for a given referral count
 * @param {number} referralCount - Current number of referrals
 * @returns {object|null} - Next milestone object or null if all milestones reached
 */
const getNextMilestone = (referralCount) => {
  return REFERRAL_MILESTONES.find(m => m.count > referralCount) || null;
};

/**
 * Get all completed milestones for a referral count
 * @param {number} referralCount - Current number of referrals
 * @returns {array} - Array of completed milestone objects
 */
const getCompletedMilestones = (referralCount) => {
  return REFERRAL_MILESTONES.filter(m => m.count <= referralCount);
};

/**
 * Calculate total credits earned from all completed milestones
 * @param {number} referralCount - Current number of referrals
 * @returns {number} - Total credits earned
 */
const getTotalMilestoneCredits = (referralCount) => {
  return getCompletedMilestones(referralCount)
    .reduce((total, m) => total + m.credits, 0);
};

/**
 * Get progress to next milestone
 * @param {number} referralCount - Current number of referrals
 * @returns {object} - Progress information
 */
const getMilestoneProgress = (referralCount) => {
  const nextMilestone = getNextMilestone(referralCount);
  
  if (!nextMilestone) {
    return {
      completed: true,
      message: 'All milestones completed! 🎉',
      progress: 100,
      referralsNeeded: 0,
      nextMilestone: null
    };
  }

  const lastMilestone = getCompletedMilestones(referralCount).pop();
  const previousCount = lastMilestone ? lastMilestone.count : 0;
  const range = nextMilestone.count - previousCount;
  const current = referralCount - previousCount;
  const progress = Math.round((current / range) * 100);

  return {
    completed: false,
    message: `${nextMilestone.count - referralCount} more referrals to ${nextMilestone.name}`,
    progress: progress,
    referralsNeeded: nextMilestone.count - referralCount,
    nextMilestone: nextMilestone,
    currentCount: referralCount
  };
};

/**
 * Get all milestones (for display purposes)
 * @returns {array} - Array of all milestone objects
 */
const getAllMilestones = () => {
  return [...REFERRAL_MILESTONES];
};

module.exports = {
  REFERRAL_MILESTONES,
  getMilestoneByCount,
  getNextMilestone,
  getCompletedMilestones,
  getTotalMilestoneCredits,
  getMilestoneProgress,
  getAllMilestones
};
