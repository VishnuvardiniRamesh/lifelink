const express = require("express");
const Donor = require("../models/Donor");
const { protect } = require("../middleware/auth");
const { isEligible, compatibleDonorTypes } = require("../utils/eligibility");

const router = express.Router();

// GET /api/donors/search?bloodType=O+&lat=13.01&lng=80.22&radiusKm=10&compatible=true
// Returns nearby donors, closest first, each tagged with live eligibility.
router.get("/search", async (req, res) => {
  try {
    const { bloodType, lat, lng, radiusKm = 10, compatible } = req.query;
    if (!bloodType || !lat || !lng) {
      return res.status(400).json({ message: "bloodType, lat and lng are required" });
    }

    const types = compatible === "true" ? compatibleDonorTypes(bloodType) : [bloodType];

    const donors = await Donor.find({
      bloodType: { $in: types },
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radiusKm) * 1000, // metres
        },
      },
    }).select("-password");

    const withEligibility = donors.map((d) => ({
      ...d.toObject(),
      eligibility: isEligible(d),
    }));

    res.json({ count: withEligibility.length, donors: withEligibility });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/donors/me — donor updates own profile / availability / last donation date
router.patch("/me", protect("donor"), async (req, res) => {
  try {
    const updates = (({ isAvailable, lastDonationDate, healthFlags, lat, lng, phone }) => {
      const out = { isAvailable, lastDonationDate, healthFlags, phone };
      if (lat && lng) out.location = { type: "Point", coordinates: [lng, lat] };
      return out;
    })(req.body);

    const donor = await Donor.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/donors/me
router.get("/me", protect("donor"), async (req, res) => {
  const donor = await Donor.findById(req.user.id).select("-password");
  res.json(donor);
});

module.exports = router;
