import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Editor.css';

interface Keystroke {
  duration: number;
  timestamp: Date;
}

interface PasteEvent {
  length: number;
  timestamp: Date;
}

export default function Editor() {
  const [content, setContent] = useState('');
  const { token, logout } = useAuth();
  const activeKeys = useRef<Map<string, number>>(new Map());
  const keystrokes = useRef<Keystroke[]>([]);
  const pasteEvents = useRef<PasteEvent[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!activeKeys.current.has(e.code)) {
      activeKeys.current.set(e.code, Date.now());
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pressTime = activeKeys.current.get(e.code);
    if (pressTime) {
      const duration = Date.now() - pressTime;
      keystrokes.current.push({ duration, timestamp: new Date() });
      activeKeys.current.delete(e.code);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    pasteEvents.current.push({ length: pastedText.length, timestamp: new Date() });
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/session', {
        content,
        keystrokes: keystrokes.current,
        pasteEvents: pasteEvents.current
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Session saved successfully!');
      keystrokes.current = [];
      pasteEvents.current = [];
    } catch (err) {
      alert('Error saving session');
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Vi-Notes</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      <textarea
        className="writing-area"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        placeholder="Start writing naturally..."
      />
      <button className="save-btn" onClick={handleSave}>
        Save Session
      </button>
    </div>
  );
}