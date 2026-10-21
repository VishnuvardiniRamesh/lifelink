const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");

const router = express.Router();

function signToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/donor/register
router.post("/donor/register", async (req, res) => {
  try {
    const { name, email, password, phone, bloodType, lat, lng, dateOfBirth } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const donor = await Donor.create({
      name, email, phone, bloodType, dateOfBirth,
      password: hashed,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    res.status(201).json({ token: signToken(donor._id, "donor"), donor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/hospital/register
router.post("/hospital/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, lat, lng } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const hospital = await Hospital.create({
      name, email, phone, address,
      password: hashed,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    res.status(201).json({ token: signToken(hospital._id, "hospital"), hospital });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login  { email, password, role: "donor" | "hospital" }
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === "hospital" ? Hospital : Donor;
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    res.json({ token: signToken(user._id, role || "donor"), user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
