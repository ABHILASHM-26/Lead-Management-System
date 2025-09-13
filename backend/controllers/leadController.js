const Lead = require("../models/Lead");

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: "Invalid lead data", error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      email,
      company,
      city,
      source,
      status,
      score_eq,
      score_gt,
      score_lt,
      score_between,
      value_gt,
      value_lt,
      created_before,
      created_after,
      qualified,
    } = req.query;

    const filters = {};

    if (email) filters.email = { $regex: email, $options: "i" };
    if (company) filters.company = { $regex: company, $options: "i" };
    if (city) filters.city = { $regex: city, $options: "i" };

    if (source) filters.source = { $in: source.split(",") };
    if (status) filters.status = { $in: status.split(",") };

    if (score_eq) filters.score = +score_eq;
    if (score_gt || score_lt) {
      filters.score = {};
      if (score_gt) filters.score.$gt = +score_gt;
      if (score_lt) filters.score.$lt = +score_lt;
    }
    if (score_between) {
      const [min, max] = score_between.split(",").map(Number);
      filters.score = { $gte: min, $lte: max };
    }

    if (value_gt || value_lt) {
      filters.lead_value = {};
      if (value_gt) filters.lead_value.$gt = +value_gt;
      if (value_lt) filters.lead_value.$lt = +value_lt;
    }

    if (created_before || created_after) {
      filters.createdAt = {};
      if (created_after) filters.createdAt.$gte = new Date(created_after);
      if (created_before) filters.createdAt.$lte = new Date(created_before);
    }


    if (qualified === "true") filters.is_qualified = true;
    if (qualified === "false") filters.is_qualified = false;


    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(filters);
    const leads = await Lead.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(parseInt(limit), 100));

    res.json({
      data: leads,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leads", error: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lead" });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: "Error updating lead" });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lead" });
  }
};
