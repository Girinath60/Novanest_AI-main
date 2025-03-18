require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User'); // Ensure this path is correct
const Startup = require('./models/Startup'); // Ensure this path is correct
const InvestmentOpportunity = require('./models/InvestmentOpportunity'); // Ensure this path is correct
const authMiddleware = require('./middleware/authMiddleware'); // Ensure this path is correct
const roleMiddleware = require('./middleware/roleMiddleware'); // Ensure this path is correct
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const founderMiddleware = require('./middleware/founderMiddleware'); // Add this line
const Message = require('./models/Message'); // Add this near your other requires
const Notification = require('./models/Notification'); // Add this near your other model imports in index.js

// Create a schema for startup analytics
const startupAnalyticsSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true,
  },
  views: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }],
  pitchDeckViews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }],
  messages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }]
});

const StartupAnalytics = mongoose.model('StartupAnalytics', startupAnalyticsSchema);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Update Multer configuration to handle multiple files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (file.fieldname === 'logo') return 'startups/logos';
      if (file.fieldname === 'pitchDeck') return 'startups/pitchdecks';
      if (file.fieldname === 'demoVideo') return 'startups/videos';
      return 'startups/others';
    },
    format: async (req, file) => {
      if (file.fieldname === 'logo') return 'png';
      if (file.fieldname === 'pitchDeck') return 'pdf';
      if (file.fieldname === 'demoVideo') return 'mp4';
      return 'raw';
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
    resource_type: (req, file) => {
      if (file.fieldname === 'demoVideo') return 'video';
      if (file.fieldname === 'pitchDeck' || file.fieldname === 'logo') return 'raw';
      return 'auto';
    }
  }
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'pitchDeck', maxCount: 1 },
  { name: 'demoVideo', maxCount: 1 }
]);

// Configure Cloudinary for profile photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles',
    format: async (req, file) => 'png',
    public_id: (req, file) => `profile-${req.user.id}-${Date.now()}`
  }
});

const profilePhotoUpload = multer({ storage: profilePhotoStorage });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password, role, profileDetails } = req.body;
  try {
    const user = new User({ name, email, password, role, profileDetails });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Protected Route Example
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get startups with filtering
app.get('/api/startups', async (req, res) => {
  try {
    const { industry, stage, fundingGoal, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (industry) {
      filter.industry = { $regex: new RegExp(industry, 'i') };
    }
    
    if (stage) {
      filter.stage = { $regex: new RegExp(stage, 'i') };
    }
    
    if (fundingGoal) {
      // Convert funding goal to number for comparison
      // This assumes fundingGoal is stored as a number
      // If fundingGoal is stored as a string, you may need to modify this logic
      filter.fundingGoal = { $lte: parseInt(fundingGoal) };
    }
    
    if (search) {
      // Add search functionality for startup name and description
      filter.$or = [
        { startupName: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    const startups = await Startup.find(filter).populate('founderId', 'name email profileDetails');
    res.status(200).json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to get startup details by ID
app.get('/api/startups/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('founderId', 'name email profileDetails');
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    res.status(200).json(startup);
  } catch (error) {
    console.error('Error fetching startup:', error);
    res.status(500).send('Server error');
  }
});

// POST route to save startup details
app.post('/api/startups', authMiddleware, cpUpload, async (req, res) => {
  try {
    // Extract file paths
    const logoUrl = req.files.logo ? req.files.logo[0].path : null;
    const pitchDeckURL = req.files.pitchDeck ? req.files.pitchDeck[0].path : null;
    const demoVideoURL = req.files.demoVideo ? req.files.demoVideo[0].path : null;
    
    if (!pitchDeckURL) {
      return res.status(400).send('Pitch deck is required');
    }

    // Add to backend/index.js before processing uploads
    if (req.files.demoVideo && req.files.demoVideo[0].size > 50000000) { // 50MB limit
      return res.status(400).send('Demo video size exceeds the maximum allowed (50MB)');
    }

    // Check if the user has reached the maximum number of startups
    const MAX_STARTUPS_PER_USER = 5; // Define your limit
    const existingStartups = await Startup.countDocuments({ founderId: req.user.id });
    if (existingStartups >= MAX_STARTUPS_PER_USER) {
      return res.status(400).send(`You can only have ${MAX_STARTUPS_PER_USER} active startups.`);
    }

    // Extract basic startup details from form
    const {
      // Basic Info
      startupName, tagline, website, location,
      
      // Business Description
      industry, problemStatement, solution, businessModel, stage, targetAudience,
      
      // Product & Traction
      businessModelType, currentCustomers, tractionMetrics, competitors,
      
      // Fundraising
      fundingGoal, useOfFunds, equityOffered, previousFunding,
      
      // Financial Performance
      revenueModel, currentRevenue, projectedGrowth, burnRate, breakEvenPoint,
      
      // Team & Market
      founderBackground, teamMembers, mentorsAdvisors,
      marketSize, customerValidation, goToMarketStrategy,
    } = req.body;

    // Create and save the startup
    const startup = new Startup({
      // Basic Info
      founderId: req.user.id,
      startupName,
      tagline,
      website,
      location,
      logoUrl,
      
      // Business Description
      industry,
      problemStatement,
      solution,
      businessModel,
      stage,
      targetAudience,
      
      // Product & Traction
      businessModelType,
      currentCustomers,
      tractionMetrics,
      competitors,
      
      // Fundraising
      fundingGoal,
      useOfFunds,
      equityOffered,
      previousFunding,
      
      // Financial Performance
      revenueModel,
      currentRevenue,
      projectedGrowth,
      burnRate,
      breakEvenPoint,
      
      // Team & Market
      founderBackground,
      teamMembers,
      mentorsAdvisors,
      marketSize,
      customerValidation,
      goToMarketStrategy,
      
      // Media
      pitchDeckURL,
      demoVideoURL,
    });

    await startup.save();
    res.status(201).json(startup);
  } catch (error) {
    console.error('Error creating startup:', error);
    res.status(400).send(error.message);
  }
});

// PUT route to update a startup
app.put('/api/startups/:id', authMiddleware, cpUpload, async (req, res) => {
  try {
    const startupId = req.params.id;
    
    // Check if user is the founder
    const existingStartup = await Startup.findById(startupId);
    if (!existingStartup) {
      return res.status(404).send('Startup not found');
    }
    
    if (existingStartup.founderId.toString() !== req.user.id) {
      return res.status(403).send('Only the founder can edit this startup');
    }
    
    // Handle file uploads
    const updateData = { ...req.body };
    
    if (req.files.logo && req.files.logo[0]) {
      updateData.logoUrl = req.files.logo[0].path;
    }
    
    if (req.files.pitchDeck && req.files.pitchDeck[0]) {
      updateData.pitchDeckURL = req.files.pitchDeck[0].path;
    }
    
    if (req.files.demoVideo && req.files.demoVideo[0]) {
      updateData.demoVideoURL = req.files.demoVideo[0].path;
    }
    
    // Update startup
    const updatedStartup = await Startup.findByIdAndUpdate(
      startupId,
      updateData,
      { new: true, runValidators: true }
    ).populate('founderId', 'name email profileDetails');
    
    res.status(200).json(updatedStartup);
  } catch (error) {
    console.error('Error updating startup:', error);
    res.status(400).send(error.message);
  }
});

// DELETE route to delete a startup
app.delete('/api/startups/:id', authMiddleware, founderMiddleware, async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    res.status(200).send('Startup deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update view recording endpoint to create notifications
app.post('/api/startups/:id/view', authMiddleware, async (req, res) => {
  try {
    const startupId = req.params.id;
    const userId = req.user.id;
    
    // Find startup to get owner ID
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    
    // Record view data
    let analytics = await StartupAnalytics.findOne({ startupId });
    if (!analytics) {
      analytics = new StartupAnalytics({ startupId, views: [], pitchDeckViews: [], messages: [] });
    }
    
    analytics.views.push({ userId });
    await analytics.save();
    
    // Create notification for startup owner if it's not the owner viewing
    if (startup.founderId.toString() !== userId) {
      // Check if owner allows profile view notifications
      const owner = await User.findById(startup.founderId);
      if (owner && owner.notificationPreferences?.profileViews) {
        const viewer = await User.findById(userId);
        createNotification(
          startup.founderId, 
          `${viewer.name} viewed your startup "${startup.startupName}"`,
          'startup_view',
          `/startup/${startup._id}`
        );
      }
    }
    
    res.status(200).send('View recorded');
  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).send('Server error');
  }
});

// Record a pitch deck view
app.post('/api/startups/:id/pitchdeck-view', authMiddleware, async (req, res) => {
  try {
    const startupId = req.params.id;
    const userId = req.user.id;
    
    // Find or create analytics document
    let analytics = await StartupAnalytics.findOne({ startupId });
    if (!analytics) {
      analytics = new StartupAnalytics({ startupId, views: [], pitchDeckViews: [], messages: [] });
    }
    
    // Add the pitch deck view
    analytics.pitchDeckViews.push({ userId });
    await analytics.save();
    
    res.status(200).send('Pitch deck view recorded');
  } catch (error) {
    console.error('Error recording pitch deck view:', error);
    res.status(500).send('Server error');
  }
});

// Get conversation with another user
app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Find messages where the current user is either sender or recipient
    // and the other user is the other party
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Server error');
  }
});

// Get messages with filters (query by userId or by conversation)
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    const currentUserId = req.user.id;
    
    // If userId is provided, fetch messages with that specific user
    if (userId) {
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, recipient: userId },
          { sender: userId, recipient: currentUserId }
        ]
      }).sort({ timestamp: 1 });
      
      return res.status(200).json(messages);
    }
    
    // If no userId provided, fetch all messages for current user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { recipient: currentUserId }
      ]
    }).sort({ timestamp: -1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Server error');
  }
});

// Send a message to another user
app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { recipient, content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).send('Message content cannot be empty');
    }

    const message = new Message({
      sender: req.user.id,
      recipient,
      content,
    });

    await message.save();
    
    // Check if recipient is a founder and record message for analytics
    const recipientUser = await User.findById(recipient);
    if (recipientUser && recipientUser.role === 'entrepreneur') {
      // Find startups by this entrepreneur
      const startups = await Startup.find({ founderId: recipient });
      
      // Record message for each startup
      for (const startup of startups) {
        let analytics = await StartupAnalytics.findOne({ startupId: startup._id });
        if (!analytics) {
          analytics = new StartupAnalytics({ startupId: startup._id, views: [], pitchDeckViews: [], messages: [] });
        }
        
        analytics.messages.push({ userId: req.user.id });
        await analytics.save();
      }
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Server error');
  }
});

// Get a list of conversations (for inbox)
app.get('/api/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all messages where the current user is involved
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    }).sort({ timestamp: -1 });
    
    // Create a map of unique conversations
    const conversations = {};
    messages.forEach(message => {
      // Determine the other party in the conversation
      const otherParty = message.sender.toString() === userId 
        ? message.recipient.toString() 
        : message.sender.toString();
      
      // Only add the most recent message from each conversation
      if (!conversations[otherParty]) {
        conversations[otherParty] = {
          otherPartyId: otherParty,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: message.recipient.toString() === userId && !message.read
        };
      }
    });
    
    res.status(200).json(Object.values(conversations));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).send('Server error');
  }
});

// Get a list of conversations with user details (for inbox)
app.get('/api/conversations/details', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all messages where the current user is involved
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    }).sort({ timestamp: -1 });
    
    // Create a map of unique conversations
    const conversationsMap = {};
    
    messages.forEach(message => {
      // Determine the other party in the conversation
      const otherParty = message.sender.toString() === userId 
        ? message.recipient.toString() 
        : message.sender.toString();
      
      // Only add the most recent message from each conversation
      if (!conversationsMap[otherParty]) {
        conversationsMap[otherParty] = {
          otherPartyId: otherParty,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: message.recipient.toString() === userId && !message.read
        };
      }
    });
    
    // Get unique user IDs from conversations
    const otherPartyIds = Object.keys(conversationsMap);
    
    // Fetch user details for all conversation participants
    const users = await User.find(
      { _id: { $in: otherPartyIds } },
      { name: 1, email: 1, profileDetails: 1, role: 1 }
    );
    
    // Map user details to conversations
    const conversationsWithDetails = otherPartyIds.map(id => {
      const user = users.find(u => u._id.toString() === id);
      return {
        ...conversationsMap[id],
        user: user || { name: 'Unknown User' }
      };
    });
    
    // Sort by most recent message
    conversationsWithDetails.sort((a, b) => b.timestamp - a.timestamp);
    
    res.status(200).json(conversationsWithDetails);
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    res.status(500).send('Server error');
  }
});

// Mark messages as read
app.put('/api/messages/read/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Update all unread messages where the current user is the recipient
    // and the other user is the sender
    const result = await Message.updateMany(
      { sender: userId, recipient: req.user.id, read: false },
      { read: true }
    );
    
    res.status(200).json({ markedRead: result.modifiedCount });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).send('Server error');
  }
});

// Get unread message count
app.get('/api/messages/unread/count', authMiddleware, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      read: false
    });
    
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).send('Server error');
  }
});

// Get analytics for a startup
app.get('/api/startups/:id/analytics', authMiddleware, async (req, res) => {
  try {
    const startupId = req.params.id;
    
    // Check if user is the founder
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    
    if (startup.founderId.toString() !== req.user.id) {
      return res.status(403).send('Only the founder can view analytics');
    }
    
    // Get analytics
    const analytics = await StartupAnalytics.findOne({ startupId });
    
    if (!analytics) {
      return res.status(200).json({
        viewsCount: 0,
        uniqueViewsCount: 0,
        pitchDeckViews: 0,
        messageCount: 0
      });
    }
    
    // Count unique views
    const uniqueViewerIds = new Set();
    analytics.views.forEach(view => uniqueViewerIds.add(view.userId.toString()));
    
    res.status(200).json({
      viewsCount: analytics.views.length,
      uniqueViewsCount: uniqueViewerIds.size,
      pitchDeckViews: analytics.pitchDeckViews.length,
      messageCount: analytics.messages.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).send('Server error');
  }
});

// Add a route to get user details by ID
app.get('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
});

// Find around line 734 where this endpoint is defined
app.get('/api/entrepreneurs/:id/startups', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user.id;
    
    // Debug log the IDs to verify they match
    console.log('URL param ID:', userId);
    console.log('Auth token ID:', authUserId);
    console.log('ID types:', typeof userId, typeof authUserId);
    
    // Validate the ID before using it
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Ensure consistent ID format by converting both to strings for comparison
    // Add protection so users can only see their own startups (optional security)
    // const isOwnStartups = userId.toString() === authUserId.toString();
    // if (!isOwnStartups) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }
    
    // Find startups with proper ID conversion if needed
    const startups = await Startup.find({ founderId: userId });
    console.log(`Found ${startups.length} startups for user ${userId}`);
    
    res.status(200).json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).send('Server error');
  }
});

// Update user profile
app.put('/api/users/:id', authMiddleware, profilePhotoUpload.single('profilePhoto'), async (req, res) => {
  try {
    // Check if the user is updating their own profile - FIXED COMPARISON
    if (req.params.id.toString() !== req.user.id.toString()) {
      return res.status(403).send('You can only update your own profile');
    }
    
    const updateData = { ...req.body };
    
    // Handle profile details
    const profileDetails = {};
    
    // Extract profile fields from form
    const profileFields = [
      'bio', 'experience', 'dateOfBirth', 'address', 'phone', 'linkedin', 'website',
      'investmentFocus', 'investmentRange', 'previousInvestments', 'yearsOfExperience'
    ];
    
    profileFields.forEach(field => {
      if (updateData[field] !== undefined) {
        profileDetails[field] = updateData[field];
        delete updateData[field];
      }
    });
    
    // Add profile photo if uploaded
    if (req.file) {
      profileDetails.profilePhoto = req.file.path;
    }
    
    // Process expertise and mentorship areas (converting comma-separated strings to arrays)
    if (updateData.expertiseAreas) {
      updateData.expertiseAreas = updateData.expertiseAreas
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
    }
    
    // Fix by separating the variable:
    if (updateData.mentorshipAreas) {
      const mentorshipArray = updateData.mentorshipAreas
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      if (req.user.role === 'mentor') {
        updateData.mentorshipAreas = mentorshipArray;
        delete updateData.expertiseAreas;
      }
    }
    
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateData,
        profileDetails: {
          ...req.user.profileDetails,
          ...profileDetails
        }
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Server error');
  }
});

// Add these endpoints

// Get user notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Server error');
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).send('Notification not found');
    }
    
    // Verify the notification belongs to the user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }
    
    notification.read = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send('Server error');
  }
});

// Update notification preferences
app.put('/api/users/:id/notifications', authMiddleware, async (req, res) => {
  try {
    // Verify user is updating their own settings
    if (req.params.id !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }
    
    const { messages, profileViews, startupUpdates } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Create or update notification settings
    user.notificationPreferences = {
      messages: !!messages,
      profileViews: !!profileViews,
      startupUpdates: !!startupUpdates
    };
    
    await user.save();
    res.status(200).json(user.notificationPreferences);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).send('Server error');
  }
});

// Change user password
app.put('/api/users/:id/password', authMiddleware, async (req, res) => {
  try {
    // Verify user is updating their own password
    if (req.params.id !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Verify current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Server error');
  }
});

// Create notification function (for internal use)
const createNotification = async (userId, message, type, link = null) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
      link
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Add this endpoint to backend/index.js
app.get('/api/notifications/unread/count', authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user.id,
      read: false 
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    res.status(500).send('Server error');
  }
});

// Replace the expertise route with this simplified version 
app.put('/api/users/:id/expertise', authMiddleware, async (req, res) => {
  try {
    // IMPORTANT FIX: Just use the authenticated user ID from the token
    // This ignores the URL parameter and ensures users can only update their own profile
    const tokenUserId = req.user.id.toString();
    
    // Extract expertise areas from request
    const { expertiseAreas } = req.body;
    
    if (!expertiseAreas) {
      return res.status(400).send('No expertise areas provided');
    }
    
    // Convert comma-separated string to array and clean it
    const expertiseAreasArray = expertiseAreas
      .split(',')
      .map(area => area.trim())
      .filter(area => area.length > 0);

    // Update user in database with expertise areas
    const updatedUser = await User.findByIdAndUpdate(
      tokenUserId, // Use token ID directly instead of URL parameter
      { $set: { expertiseAreas: expertiseAreasArray } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating expertise areas:', error);
    res.status(500).json({ message: 'Server error updating expertise areas' });
  }
});

mongoose.connect("mongodb://localhost:27017/novanest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));