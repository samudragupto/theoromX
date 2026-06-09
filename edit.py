import sys

file_path = r'c:\TheromX 2026\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """      <div class="section-header centered scroll-reveal">
        <p class="section-eyebrow">Track Your Research</p>
        <h2 class="section-heading">Search Your Submission</h2>
        <p class="section-subheading">Find the status of your research paper</p>
      </div>"""

replacement1 = """      <div class="section-header centered scroll-reveal">
        <p class="section-eyebrow">Track Your Research</p>
        <h2 class="section-heading">Submission Status</h2>
        <p class="section-subheading">View the current status and remarks for all submissions</p>
      </div>"""

target2 = """          const searchInput = document.getElementById('trackIdInput');
          const searchBtn = document.getElementById('searchBtn');
          const searchResults = document.getElementById('searchResults');
          const resultContent = document.getElementById('resultContent');

          function performSearch() {
            const trackId = searchInput.value.trim().toUpperCase();

            if (!trackId) {
              searchResults.style.display = 'none';
              return;
            }

            const results = submissionData.filter(item => item.trackId === trackId);

            if (results.length === 0) {
              resultContent.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-sub);">
              <p>No submission found with Track ID: ${trackId}</p>
              <p style="font-size: 0.8rem; margin-top: 0.5rem;">Please check your Track ID and try again.</p>
            </div>
          `;
              searchResults.style.display = 'block';
              return;
            }

            resultContent.innerHTML = results.map(item => `
          <div class="result-row">
            <div class="result-cell" style="font-weight: 600; color: var(--accent);">${item.trackId}</div>
            <div class="result-cell" style="font-weight: 500;">${item.author}</div>
            <div class="result-cell">${item.title}</div>
            <div class="result-cell" style="color: #10b981; font-weight: 500;"> ${item.status}</div>
            <div class="result-cell" style="font-size: 0.8rem;">${item.remarks}</div>
          </div>
        `).join('');

            searchResults.style.display = 'block';
          }

          searchBtn.addEventListener('click', performSearch);
          searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') performSearch();
          });"""

replacement2 = """          const searchResults = document.getElementById('searchResults');
          const resultContent = document.getElementById('resultContent');
          const searchInputGroup = document.querySelector('.search-input-group');

          // Hide search box and show results container
          if (searchInputGroup) searchInputGroup.style.display = 'none';
          searchResults.style.display = 'block';

          resultContent.innerHTML = '';

          // Add rows initially hidden
          const rows = [];
          submissionData.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'result-row';
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            row.innerHTML = `
              <div class="result-cell" style="font-weight: 600; color: var(--accent);">${item.trackId}</div>
              <div class="result-cell" style="font-weight: 500;">${item.author}</div>
              <div class="result-cell">${item.title}</div>
              <div class="result-cell" style="color: #10b981; font-weight: 500;"> ${item.status}</div>
              <div class="result-cell" style="font-size: 0.8rem;">${item.remarks}</div>
            `;
            
            resultContent.appendChild(row);
            rows.push(row);
          });

          // Reveal one by one when scrolled into view
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              rows.forEach((row, index) => {
                setTimeout(() => {
                  row.style.opacity = '1';
                  row.style.transform = 'translateY(0)';
                }, index * 150);
              });
              observer.disconnect();
            }
          }, { threshold: 0.1 });

          observer.observe(searchResults);"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print('Replaced target 1')
else:
    print('Could not find target 1')
    
if target2 in content:
    content = content.replace(target2, replacement2)
    print('Replaced target 2')
else:
    print('Could not find target 2')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
