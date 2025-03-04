import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey &&
    (e.key === "u" || e.key === "s" || e.key === "i" || e.key === "j")
  ) {
    e.preventDefault();
  }
  if (e.key === "F12") {
    e.preventDefault();
  }
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
