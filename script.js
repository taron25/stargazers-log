const eventsUrl = './events.json';

// Loader: combines richer rendering from the current branch with incoming branch's ARIA and error UX
async function loadStarredRepositories() {
  const status = document.getElementById('status');
  const container = document.getElementById('starred');
  if (!container) return;

  // Mark as busy for assistive tech
  container.setAttribute('aria-busy', 'true');
  container.setAttribute('aria-live', 'polite');

  try {
    const response = await fetch(eventsUrl);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }

    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) {
      if (status) status.textContent = 'No starred repositories found.';
      const msg = document.createElement('p');
      msg.textContent = 'No starred repositories found.';
      msg.setAttribute('role', 'status');
      container.parentNode.insertBefore(msg, container);
      return;
    }

    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    events.forEach((event) => {
      const repoName = (event && (event.name || event.repo)) ? String(event.name || event.repo).trim() : '';
      const starredAt = event && (event.starred_at || event.starred) ? (event.starred_at || event.starred) : null;
      const formattedDate = starredAt ? (isNaN(new Date(starredAt)) ? String(starredAt) : new Date(starredAt).toLocaleDateString()) : 'Unknown date';

      const li = document.createElement('li');
      li.className = 'star-item';

      const title = document.createElement('h2');
      const link = document.createElement('a');
      // Defensive: if repoName looks like owner/repo, encode it; otherwise allow provided url
      if (event && event.url) {
        link.href = event.url;
      } else {
        link.href = repoName ? `https://github.com/${encodeURIComponent(repoName)}` : '#';
      }
      link.textContent = repoName || 'Unknown repository';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      title.appendChild(link);

      li.appendChild(title);

      const description = document.createElement('p');
      description.textContent = event && event.description ? event.description : 'No description provided.';
      li.appendChild(description);

      if (starredAt) {
        const time = document.createElement('time');
        time.dateTime = starredAt;
        time.textContent = `Starred on ${formattedDate}`;
        li.appendChild(time);
      }

      frag.appendChild(li);
    });

    container.appendChild(frag);

    if (status) status.textContent = `${events.length} starred repositories loaded.`;
  } catch (error) {
    if (status) {
      status.textContent = 'Unable to load starred repositories.';
      status.classList.add('error');
    }
    const errorMsg = document.createElement('p');
    errorMsg.setAttribute('role', 'status');
    errorMsg.textContent = 'Could not load starred repositories.';
    if (container && container.parentNode) container.parentNode.insertBefore(errorMsg, container);
    console.error('Failed to load events.json', error);
  } finally {
    container.removeAttribute('aria-busy');
  }
}

document.addEventListener('DOMContentLoaded', loadStarredRepositories);
