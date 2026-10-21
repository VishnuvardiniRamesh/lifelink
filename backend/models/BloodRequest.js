const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    bloodType: {
      type: String,
      required: true,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    },
    unitsNeeded: { type: Number, default: 1 },
    radiusKm: { type: Number, default: 10 },
    urgency: { type: String, enum: ["normal", "urgent", "critical"], default: "urgent" },
    status: { type: String, enum: ["open", "fulfilled", "cancelled"], default: "open" },
    notifiedDonors: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
        notifiedAt: { type: Date, default: Date.now },
        response: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
