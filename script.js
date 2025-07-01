const GITHUB_TOKEN = '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'; // Replace with your real token

 // ← Replace this with your token
let currentPage = 1;

function searchGitHub(page = 1) {
  const keyword = document.getElementById("searchInput").value.trim();
  const searchType = document.getElementById("searchType").value;
  const resultsDiv = document.getElementById("results");
  const paginationDiv = document.getElementById("pagination");
  resultsDiv.innerHTML = "";
  paginationDiv.innerHTML = "";
  currentPage = page;

  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    resultsDiv.style.color="#e80202";
    return;
  }

  const perPage = 10;
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: searchType === "commits"
      ? "application/vnd.github.cloak-preview"
      : "application/vnd.github.v3+json"
  };

  let endpoint = "";
  if (searchType === "repositories") {
    endpoint = `https://api.github.com/search/repositories?q=${keyword}&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
  } else if (searchType === "users") {
    endpoint = `https://api.github.com/search/users?q=${keyword}&page=${page}&per_page=${perPage}`;
  } else if (searchType === "commits") {
    endpoint = `https://api.github.com/search/commits?q=${keyword}&page=${page}&per_page=${perPage}`;
  }

  fetch(endpoint, { headers: headers })
    .then(res => res.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const div = document.createElement("div");
          div.className = "repo";

          if (searchType === "repositories") {
            div.innerHTML = `
              <a href="${item.html_url}" target="_blank">${item.full_name}</a>
              <p>${item.description || "No description"}</p>
              <small>⭐ ${item.stargazers_count} | 🛠️ ${item.language || "N/A"}</small>
            `;
          } else if (searchType === "users") {
            div.innerHTML = `
              <a href="${item.html_url}" target="_blank">${item.login}</a>
              <p>Type: ${item.type}</p>
              <img src="${item.avatar_url}" width="50" height="50" />
            `;
          } else if (searchType === "commits") {
            const commit = item.commit;
            div.innerHTML = `
              <p><strong>${commit.message.split('\n')[0]}</strong></p>
              <p>Author: ${commit.author.name}</p>
              <a href="${item.html_url}" target="_blank">View Commit</a>
            `;
          }

          resultsDiv.appendChild(div);
        });

        paginationDiv.innerHTML = `
          <button onclick="searchGitHub(${page - 1})" ${page === 1 ? "disabled" : ""}>⬅ Previous</button>
          <span>Page ${page}</span>
          <button onclick="searchGitHub(${page + 1})">Next ➡</button>
        `;
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch(err => {
      console.error(err);
      resultsDiv.innerHTML = "<p>Error fetching data from GitHub API.</p>";
    });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
