import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './NotesList.css';
import toast from 'react-hot-toast';

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(response.data);
      } catch (err) {
        // alert('Failed to load notes');
        toast.error("Failed to load notes");
      }
    };
    fetchNotes();
  }, [token]);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Saved Notes</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Add New Note</button>
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
                  <span style={{color: "red"}} className="tag-pasted"> Contains Pasted Text</span>
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