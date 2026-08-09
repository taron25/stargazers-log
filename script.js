async function loadStarred() {
  const container = document.querySelector("#starred");
  if (!container) {
    console.error("Missing #starred container in the DOM");
    return;
  }

  // Show a loading message
  container.innerHTML = "<li>Loading…</li>";

  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Failed to load events.json (status ${response.status})`);
    }

    const events = await response.json();

    if (!Array.isArray(events) || events.length === 0) {
      container.innerHTML = "<li>No starred repositories found.</li>";
      return;
    }

    container.innerHTML = "";
    events.forEach((event) => {
      const name = event && event.name ? event.name : "unknown";
      const starred = event && event.starred ? event.starred : "unknown date";
      const item = document.createElement("li");
      item.textContent = `${name} — starred ${starred}`;
      container.appendChild(item);
    });
  } catch (err) {
    console.error("Error loading or parsing events.json:", err);
    container.innerHTML = "<li>Could not load starred repositories. Please try again later.</li>";
  }
}

document.addEventListener("DOMContentLoaded", loadStarred);
