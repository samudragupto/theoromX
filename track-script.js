// Track Status Search Functionality
document.addEventListener('DOMContentLoaded', function() {
  const trackSearchInput = document.getElementById('trackSearchInput');
  const trackTableBody = document.getElementById('trackTableBody');
  if (trackTableBody && trackSearchInput) {
    const trackRows = trackTableBody.querySelectorAll('tr');
    trackSearchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      trackRows.forEach(row => {
        const trackId = row.querySelector('.track-id');
        const trackTitle = row.querySelector('.track-title');
        if (trackId && trackTitle) {
          const idText = trackId.textContent.toLowerCase();
          const titleText = trackTitle.textContent.toLowerCase();
          if (idText.includes(searchTerm) || titleText.includes(searchTerm) || searchTerm === '') {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }
});
