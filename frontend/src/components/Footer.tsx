import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Vi-Notes - Sachin Singh</p>
        <p className="footer-subtext">Ensuring genuine human writing.</p>
      </div>
    </footer>
  );
}