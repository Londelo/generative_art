// Shared home button for all generative art apps
(function() {
  'use strict';

  // Create and inject home button
  const createHomeButton = () => {
    const button = document.createElement('a');
    button.href = '../index.html';
    button.className = 'home-button';
    button.innerHTML = '⌂';
    button.setAttribute('aria-label', 'Home');
    document.body.appendChild(button);
  };

  // Create and inject styles
  const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .home-button {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: rgba(24, 24, 24, 0.8);
        border: 2px solid #DBDBDB;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 28px;
        color: #DBDBDB;
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
      }

      .home-button:hover {
        background: rgba(219, 219, 219, 0.9);
        color: #181818;
        transform: scale(1.1);
        border-color: #181818;
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      createHomeButton();
    });
  } else {
    injectStyles();
    createHomeButton();
  }
})();
