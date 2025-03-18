const mongoose = require('mongoose');

const investmentOpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: String,
  // ...add more fields as needed
});

module.exports = mongoose.model('InvestmentOpportunity', investmentOpportunitySchema);