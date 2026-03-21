import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Vi-Notes Editor</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        style={{ width: '100%', height: '400px', padding: '10px', fontSize: '16px' }}
        placeholder="Start writing naturally..."
      />
      <button onClick={handleSave} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Save Session
      </button>
    </div>
  );
}