// Improved loader with error handling and accessible markup
async function loadStarred() {
  const container = document.querySelector('#starred');
  if (!container) return;

  // Mark as busy for assistive tech
  container.setAttribute('aria-busy', 'true');
  container.setAttribute('aria-live', 'polite');

  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = 'No starred repositories found.';
      msg.setAttribute('role', 'status');
      container.parentNode.insertBefore(msg, container);
      return;
    }

    const frag = document.createDocumentFragment();
    events.forEach(ev => {
      const li = document.createElement('li');

      // Repository link
      const link = document.createElement('a');
      // Defensive: trim and encode repo path like "owner/repo"
      const repoName = (ev && ev.name) ? String(ev.name).trim() : '';
      link.href = repoName ? `https://github.com/${encodeURIComponent(repoName)}` : '#';
      link.textContent = repoName || 'Unknown repository';
      // If opening in new tab, include rel for security
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      li.appendChild(link);

      // Date
      if (ev && ev.starred) {
        const time = document.createElement('time');
        time.dateTime = ev.starred;
        // Friendly display, fallback to raw string if invalid date
        const d = new Date(ev.starred);
        time.textContent = isNaN(d) ? ev.starred : d.toLocaleDateString();
        li.appendChild(document.createTextNode(' — '));
        li.appendChild(time);
      }

      frag.appendChild(li);
    });

    container.appendChild(frag);
  } catch (err) {
    // Visible error for users + accessible status
    const errorMsg = document.createElement('p');
    errorMsg.setAttribute('role', 'status');
    errorMsg.textContent = 'Could not load starred repositories.';
    container.parentNode.insertBefore(errorMsg, container);
    // Keep console error for debugging
    console.error('Failed to load events.json', err);
  } finally {
    container.removeAttribute('aria-busy');
  }
}

document.addEventListener('DOMContentLoaded', loadStarred);
