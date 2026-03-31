import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Editor.css';
import toast from 'react-hot-toast';

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
  const navigate = useNavigate();
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
    toast.error(`Do not paste, you pasted: ${pastedText}`);
    pasteEvents.current.push({ length: pastedText.length, timestamp: new Date() });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/session`, {
        content,
        keystrokes: keystrokes.current,
        pasteEvents: pasteEvents.current
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // alert('Session saved successfully!');
      toast.success('Note saved successfully');
      setContent('');
      keystrokes.current = [];
      pasteEvents.current = [];
      navigate("/notes");
    } catch (err) {
      // alert('Error saving session');
      toast.error('Error saving Note, Note cannot be empty');
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Add new note (Do not paste, you will be caught):</h2>
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
        Save Note
      </button>
    </div>
  );
}