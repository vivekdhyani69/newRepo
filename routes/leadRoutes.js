const express = require('express');
const { createLead, updateLead, deleteLead, sortLeads, getLead ,getSpecificLead} = require('../controller/leadController');
const { protect } = require('../middelware/authMiddelware');
const router = express.Router();


///give the middelware to all for making protected routes
router.post('/createLeads', protect, createLead);
router.put('/update/:id', protect, updateLead);
router.get('/getleads/:id',protect, getLead);
router.get('/getSpecificLead/:id',protect, getSpecificLead);
router.delete('/delete/:id', protect, deleteLead);
// router.get('/search', protect, searchLeads);
router.get('/sort/:userId', sortLeads);

module.exports = router;
