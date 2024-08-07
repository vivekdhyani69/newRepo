
const Lead = require('../models/Lead');
const User = require('../models/Users');

const createLead = async (req, res) => {
    const { email, name, number, product ,userId} = req.body;
console.log(req.body)
    try {
        const lead = new Lead({ email, name, number, product,  createdBy: userId });
        await lead.save();
   // Update the user's leads array
   await User.findByIdAndUpdate(userId, { $push: { leads: lead._id } });
   res.status(201).json({ message: 'Lead created successfully', lead: lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all leads for a specific user
const getLead = async (req, res) => {
    const { id } = req.params;

  try {
    // Find all leads for the user
    const user = await User.findById(id).populate('leads');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ leads: user.leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSpecificLead = async (req, res) => {
    const { id } = req.params;

  try {
    // Find all leads for the user
    const LeadData = await Lead.findById(id);

    if (!LeadData) {
      return res.status(404).json({ error: 'LeadData not found' });
    }

    res.status(200).json({ leads: LeadData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateLead = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.status(200).json({ lead });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
          // Remove the lead reference from the user's leads array
    await User.findByIdAndUpdate(lead.createdBy, { $pull: { leads: id } });


        res.status(200).json({ message: 'Lead deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const sortLeads = async (req, res) => {
    const { userId } = req.params;
    const { sortBy } = req.query; // sortBy could be 'asc' or 'desc'

    try {
        const sortOrder = sortBy === 'asc' ? 1 : -1;

        const leads = await Lead.find({ createdBy: userId }).sort({ name: sortOrder });

        res.status(200).json({ leads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getSpecificLead, createLead,getLead, updateLead, deleteLead, sortLeads };
