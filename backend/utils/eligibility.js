const GAP_DAYS = parseInt(process.env.DONOR_ELIGIBILITY_GAP_DAYS || "90", 10);

/**
 * Determines whether a donor is currently eligible to donate.
 * Rules (extend as needed for your project):
 *  - Marked available by the donor
 *  - No chronic illness / recent surgery / active medication flag
 *  - Last donation was at least GAP_DAYS days ago (or never donated)
 */
function isEligible(donor) {
  if (!donor.isAvailable) return { eligible: false, reason: "Marked unavailable" };

  const { chronicIllness, recentSurgery, onMedication } = donor.healthFlags || {};
  if (chronicIllness) return { eligible: false, reason: "Chronic illness flag" };
  if (recentSurgery) return { eligible: false, reason: "Recent surgery flag" };
  if (onMedication) return { eligible: false, reason: "Active medication flag" };

  if (donor.lastDonationDate) {
    const daysSince = (Date.now() - new Date(donor.lastDonationDate).getTime()) / 86400000;
    if (daysSince < GAP_DAYS) {
      return { eligible: false, reason: `Only ${Math.floor(daysSince)} days since last donation (needs ${GAP_DAYS})` };
    }
  }

  return { eligible: true, reason: "Eligible" };
}

// Blood-type compatibility: which donor types can give to a given recipient type
const COMPATIBILITY = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

function compatibleDonorTypes(recipientType) {
  return COMPATIBILITY[recipientType] || [recipientType];
}

module.exports = { isEligible, compatibleDonorTypes, GAP_DAYS };
