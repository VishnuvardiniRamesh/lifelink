const express = require("express");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");
const { protect } = require("../middleware/auth");
const { isEligible, compatibleDonorTypes } = require("../utils/eligibility");

const router = express.Router();

// POST /api/requests — hospital raises an emergency request; matches + "notifies" eligible donors
router.post("/", protect("hospital"), async (req, res) => {
  try {
    const { bloodType, unitsNeeded = 1, radiusKm = 10, urgency = "urgent", lat, lng } = req.body;

    const eligibleTypes = compatibleDonorTypes(bloodType);
    const candidates = await Donor.find({
      bloodType: { $in: eligibleTypes },
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radiusKm) * 1000,
        },
      },
    });

    const eligibleDonors = candidates.filter((d) => isEligible(d).eligible);

    const request = await BloodRequest.create({
      hospital: req.user.id,
      bloodType, unitsNeeded, radiusKm, urgency,
      notifiedDonors: eligibleDonors.map((d) => ({ donor: d._id })),
    });

    // In production: integrate a push/SMS provider here (e.g. FCM, Twilio) to
    // actually notify eligibleDonors. This scaffold just records the match.

    res.status(201).json({ request, notified: eligibleDonors.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/requests/mine — hospital views its own requests
router.get("/mine", protect("hospital"), async (req, res) => {
  const requests = await BloodRequest.find({ hospital: req.user.id })
    .populate("notifiedDonors.donor", "name bloodType phone")
    .sort("-createdAt");
  res.json(requests);
});

// PATCH /api/requests/:id/respond — donor accepts/declines an alert
router.patch("/:id/respond", protect("donor"), async (req, res) => {
  try {
    const { response } = req.body; // "accepted" | "declined"
    const request = await BloodRequest.findOneAndUpdate(
      { _id: req.params.id, "notifiedDonors.donor": req.user.id },
      { $set: { "notifiedDonors.$.response": response } },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request/notification not found" });
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
