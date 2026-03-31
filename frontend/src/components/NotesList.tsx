import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './NotesList.css';

interface SessionData {
  _id: string;
  content: string;
  pasteEvents: any[];
  createdAt: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<SessionData[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(response.data);
      } catch (err) {
        alert('Failed to load notes');
      }
    };
    fetchNotes();
  }, [token]);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Saved Notes</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Back to Editor</button>
      </div>
      
      <div className="notes-grid">
        {notes.length === 0 ? (
          <p>No notes found. Start writing!</p>
        ) : (
          notes.map(note => (
            <div key={note._id} className="note-card">
              <div className="note-meta">
                <span className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                </span>
                {note.pasteEvents.length > 0 && (
                  <span className="tag-pasted">⚠️ Contains Pasted Text</span>
                )}
              </div>
              <div className="note-content">
                {note.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}