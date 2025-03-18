const Startup = require('../models/Startup');

const founderMiddleware = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    if (startup.createdBy.toString() !== req.user.id) {
      return res.status(403).send('Access denied. Only the founder can edit this startup.');
    }
    next();
  } catch (error) {
    res.status(500).send('Server error');
  }
};

module.exports = founderMiddleware;