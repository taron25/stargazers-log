const status = document.getElementById('status');
const list = document.getElementById('starred');
const eventsUrl = './events.json';

async function loadStarredRepositories() {
  try {
    const response = await fetch(eventsUrl);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error('Invalid data format: expected an array of starred repository events.');
    }

    if (events.length === 0) {
      status.textContent = 'No starred repositories found.';
      return;
    }

    list.innerHTML = '';
    events.forEach((event) => {
      const repoName = event.name || 'Unknown repository';
      const starredAt = event.starred_at || event.starred || null;
      const formattedDate = starredAt ? new Date(starredAt).toLocaleDateString() : 'Unknown date';
      const url = event.url || '#';

      const item = document.createElement('li');
      item.className = 'star-item';

      const title = document.createElement('h2');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = repoName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      title.appendChild(link);

      const description = document.createElement('p');
      description.textContent = event.description || 'No description provided.';

      const time = document.createElement('time');
      if (starredAt) {
        time.dateTime = starredAt;
      }
      time.textContent = `Starred on ${formattedDate}`;

      item.appendChild(title);
      item.appendChild(description);
      item.appendChild(time);
      list.appendChild(item);
    });

    status.textContent = `${events.length} starred repositories loaded.`;
  } catch (error) {
    status.textContent = 'Unable to load starred repositories.';
    status.classList.add('error');
    console.error(error);
  }
}

loadStarredRepositories();
