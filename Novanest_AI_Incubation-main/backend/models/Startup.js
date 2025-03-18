const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  // Basic Info
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: true,
  },
  tagline: String,
  website: String,
  location: String,
  logoUrl: String,
  
  // Business Description
  industry: {
    type: String,
    required: true,
  },
  problemStatement: String,
  solution: String,
  businessModel: {
    type: String,
    required: true,
  },
  targetAudience: String,
  
  // Product & Traction
  stage: {
    type: String,
    enum: ['Idea', 'MVP', 'Scaling', 'Revenue'],
    default: 'Idea',
    required: true,
  },
  businessModelType: String,
  currentCustomers: String,
  tractionMetrics: String,
  competitors: String,
  
  // Fundraising
  fundingGoal: {
    type: String,
    required: true,
  },
  useOfFunds: String,
  equityOffered: String,
  previousFunding: String,
  
  // Financial Performance
  revenueModel: String,
  currentRevenue: String,
  projectedGrowth: String,
  burnRate: String,
  breakEvenPoint: String,
  
  // Team & Market
  founderBackground: String,
  teamMembers: String,
  mentorsAdvisors: String,
  marketSize: String,
  customerValidation: String,
  goToMarketStrategy: String,
  
  // Media
  pitchDeckURL: {
    type: String,
    required: true,
  },
  demoVideoURL: String,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the timestamp before saving
startupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Startup = mongoose.model('Startup', startupSchema);

module.exports = Startup;