// login.js
// Handles roll-down popup login and redirects to homepage on success

document.addEventListener('DOMContentLoaded', function() {
  // Attach popup logic to Login/Logout menu-bar-btn
  const menuLinks = document.querySelectorAll('.menu-bar-btn');
  menuLinks.forEach(function(link) {
    const label = link.querySelector('.menu-bar-btn__label');
    if (label && label.textContent.trim().toLowerCase().includes('login')) {
      // Remove href to prevent navigation
      link.setAttribute('href', '#');
      // Set button text based on login state
      function updateLoginButton() {
        if (window.localStorage.getItem('loggedIn') === 'true') {
          label.textContent = 'Logout';
        } else {
          label.textContent = 'Login/Logout';
        }
      }
      updateLoginButton();
      window.addEventListener('storage', updateLoginButton);
      // Also update on click (for same-tab logout)
      link.addEventListener('click', updateLoginButton);
      link.addEventListener('click', function(e) {
        e.preventDefault();
        // If logged in, log out and redirect to home
        if (window.localStorage.getItem('loggedIn') === 'true') {
          // Call backend logout to clear session
          fetch('http://127.0.0.1:5000/api/logout', {
            method: 'POST',
            credentials: 'include'
          }).finally(() => {
            window.localStorage.removeItem('loggedIn');
            updateLoginButton();
            window.location.href = '/index.html';
          });
          return;
        }
        // Prevent multiple popups
        if (document.getElementById('login-popup')) return;
        let popup = document.createElement('div');
        popup.id = 'login-popup';
        popup.style.position = 'fixed';
        popup.style.top = '-400px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'rgba(10,20,40,0.97)';
        popup.style.color = '#00fff7';
        popup.style.fontSize = '1.2em';
        popup.style.padding = '2em 2.5em 1.5em 2.5em';
        popup.style.border = '2.5px solid #00fff7';
        popup.style.borderRadius = '0.9em';
        popup.style.boxShadow = '0 0 24px 4px #00fff7cc, 0 0 0 2px #3a8ad8 inset';
        popup.style.zIndex = '9999';
        popup.style.transition = 'top 0.5s cubic-bezier(.68,-0.55,.27,1.55)';
        popup.innerHTML = `
          <form id="login-form" style="display:flex;flex-direction:column;gap:1.2em;">
            <label for="login-username" style="color:#00fff7;font-weight:600;font-size:1.2em;">Username:</label>
            <input type="text" id="login-username" name="username" required style="font-size:1.1em;padding:0.6em 1em;border-radius:0.5em;">
            <label for="login-password" style="color:#00fff7;font-weight:600;font-size:1.2em;">Password:</label>
            <input type="password" id="login-password" name="password" required style="font-size:1.1em;padding:0.6em 1em;border-radius:0.5em;">
            <button type="submit" class="steam-btn steam-btn__plate" style="background:rgba(10,20,40,0.92);border:2.5px solid #00fff7;border-radius:0.9em;box-shadow:0 0 12px 2px #00fff7cc,0 0 0 2px #3a8ad8 inset;color:#00fff7;font-weight:700;text-shadow:0 0 6px #00fff7cc,0 0 12px #00fff799;transition:box-shadow 0.18s,border-color 0.18s;font-size:1.2em;padding:0.7em 2em;margin-top:1em;">Login</button>
            <div id="login-message" style="margin-top:0.5em;"></div>
          </form>
          <button id="close-login" style="margin-top:1em;font-size:1em;color:#00fff7;background:none;border:none;cursor:pointer;">Close</button>
        `;
        document.body.appendChild(popup);
        setTimeout(() => { popup.style.top = '80px'; }, 100);
        // Close button
        document.getElementById('close-login').onclick = function() {
          popup.style.top = '-400px';
          setTimeout(() => { popup.remove(); }, 600);
        };
        // Handle login
        document.getElementById('login-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const username = document.getElementById('login-username').value.trim();
          const password = document.getElementById('login-password').value;
          const message = document.getElementById('login-message');
          if (!username || !password) {
            message.textContent = 'Please enter username and password.';
            message.style.color = 'red';
            return;
          }
          try {
            const res = await fetch('http://127.0.0.1:5000/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
              credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
              message.textContent = 'Login successful! Redirecting...';
              message.style.color = '#00fff7';
              window.localStorage.setItem('loggedIn', 'true');
              // Update all login/logout buttons on all tabs
              window.dispatchEvent(new Event('storage'));
              setTimeout(() => { window.location.href = '/'; }, 1200);
            } else {
              message.textContent = data.error || 'Login failed.';
              message.style.color = 'red';
            }
          } catch (err) {
            message.textContent = 'Server error.';
            message.style.color = 'red';
          }
        });
      });
    }
  });
});
