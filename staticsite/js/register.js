// register.js
// Handles client-side validation and AJAX registration


function showPopup(text, color) {
  let popup = document.createElement('div');
  popup.textContent = text;
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'rgba(10,20,40,0.97)';
  popup.style.color = color;
  popup.style.fontSize = '1.5em';
  popup.style.padding = '1.2em 2.2em';
  popup.style.border = '2.5px solid #00fff7';
  popup.style.borderRadius = '0.9em';
  popup.style.boxShadow = '0 0 24px 4px #00fff7cc, 0 0 0 2px #3a8ad8 inset';
  popup.style.zIndex = '9999';
  document.body.appendChild(popup);
  setTimeout(() => { popup.remove(); }, 2200);
}

document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const message = document.getElementById('register-message');

  if (password !== confirm) {
    showPopup('Passwords do not match.', 'red');
    return;
  }

  // Basic client-side validation
  if (!username || !email || password.length < 8) {
    showPopup('Please fill all fields correctly.', 'red');
    return;
  }

  // Send registration data to backend
  try {
  const res = await fetch('http://127.0.0.1:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.success) {
      showPopup('Registration successful!', '#00fff7');
      message.textContent = '';
      document.getElementById('register-form').reset();
    } else {
      showPopup(data.error || 'Registration failed.', 'red');
    }
  } catch (err) {
    showPopup('Server error.', 'red');
  }
});
