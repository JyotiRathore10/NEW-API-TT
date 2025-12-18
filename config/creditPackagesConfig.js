

const CREDIT_PACKAGES = [
  {
    id: 1,
    credits: 50,
    price: 99,
    badge: "STARTER",
    badgeColor: "starter",
    bonus: 0,
    totalCredits: 50,  // 50 + 0 bonus
    description: "Perfect for casual users",
    features: [
      "50 credits",
      "Basic features",
      "Perfect for beginners"
    ]
  },
  {
    id: 2,
    credits: 120,
    price: 199,
    badge: "MOST POPULAR",
    badgeColor: "popular",
    bonus: 20,
    totalCredits: 140,  // 120 + 20 bonus
    description: "Most popular choice",
    features: [
      "120 base credits",
      "20 bonus credits",
      "Best for regular users"
    ]
  },
  {
    id: 3,
    credits: 250,
    price: 399,
    badge: "BEST VALUE",
    badgeColor: "value",
    bonus: 50,
    totalCredits: 300,  // 250 + 50 bonus
    description: "Best value for money",
    features: [
      "250 base credits",
      "50 bonus credits",
      "Maximum savings"
    ]
  },
  {
    id: 4,
    credits: 500,
    price: 699,
    badge: "PREMIUM",
    badgeColor: "premium",
    bonus: 100,
    totalCredits: 600,  // 500 + 100 bonus
    description: "For astrology enthusiasts",
    features: [
      "500 base credits",
      "100 bonus credits",
      "All premium features"
    ]
  }
];

/**
 * Get package by ID
 * @param {number} packageId - Package ID
 * @returns {object|null} - Package object or null if not found
 */
const getPackageById = (packageId) => {
  return CREDIT_PACKAGES.find(p => p.id === parseInt(packageId)) || null;
};

/**
 * Get all packages
 * @returns {array} - Array of all package objects
 */
const getAllPackages = () => {
  return [...CREDIT_PACKAGES];
};

/**
 * Get package IDs
 * @returns {array} - Array of package IDs
 */
const getPackageIds = () => {
  return CREDIT_PACKAGES.map(p => p.id);
};

/**
 * Calculate total credits including bonus
 * @param {number} packageId - Package ID
 * @returns {number} - Total credits (base + bonus)
 */
const calculateTotalCredits = (packageId) => {
  const package_ = getPackageById(packageId);
  return package_ ? (package_.credits + package_.bonus) : 0;
};

/**
 * Validate package ID
 * @param {number} packageId - Package ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidPackageId = (packageId) => {
  return CREDIT_PACKAGES.some(p => p.id === parseInt(packageId));
};

/**
 * Get package summary for display
 * @param {number} packageId - Package ID
 * @returns {object|null} - Package summary or null
 */
const getPackageSummary = (packageId) => {
  const package_ = getPackageById(packageId);
  if (!package_) return null;

  return {
    id: package_.id,
    name: package_.badge,
    price: package_.price,
    totalCredits: package_.totalCredits,
    savings: package_.bonus > 0 ? `${package_.bonus} bonus credits` : 'No bonus'
  };
};

// Export all functions and constants
module.exports = {
  CREDIT_PACKAGES,
  getPackageById,
  getAllPackages,
  getPackageIds,
  calculateTotalCredits,
  isValidPackageId,
  getPackageSummary
};
