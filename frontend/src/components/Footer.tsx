import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Vi-Notes - Authorship Verification Platform</p>
        <p className="footer-subtext">Ensuring genuine human writing through behavioral analysis.</p>
      </div>
    </footer>
  );
}