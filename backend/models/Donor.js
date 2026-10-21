const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    bloodType: {
      type: String,
      required: true,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    },
    dateOfBirth: { type: Date },
    lastDonationDate: { type: Date, default: null },
    healthFlags: {
      // simple self-reported flags; a real system would integrate with medical records
      chronicIllness: { type: Boolean, default: false },
      recentSurgery: { type: Boolean, default: false },
      onMedication: { type: Boolean, default: false },
    },
    isAvailable: { type: Boolean, default: true }, // donor can toggle off temporarily
    location: {
      // GeoJSON Point — required for $near / $geoWithin queries
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

donorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
