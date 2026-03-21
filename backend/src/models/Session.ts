import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  keystrokes: [{
    duration: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  pasteEvents: [{
    length: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);