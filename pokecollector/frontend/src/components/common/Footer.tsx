// src/components/common/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PokéCollector</h3>
            <p>Sistema de coleccionismo de cartas Pokémon de 1ra y 2da generación.</p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="/ranking">Ranking</a></li>
              <li><a href="/collection">Mi Colección</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Información</h4>
            <ul className="footer-links">
              <li>Proyecto Universitario</li>
              <li>Node.js + React + TypeScript</li>
              <li>Principios SOLID aplicados</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 PokéCollector. Proyecto académico desarrollado con principios SOLID.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;