document.getElementById("search-button").addEventListener("click", function () {
  const searchBar = document.getElementById("search-bar");
  const searchIcon = document.getElementById("search-icon");

  if (searchBar.classList.contains("expanded")) {
    searchBar.classList.remove("expanded");
    searchIcon.classList.remove("bi-x-lg");
    searchIcon.classList.add("bi-search");
  } else {
    searchBar.classList.add("expanded");
    searchIcon.classList.remove("bi-search");
    searchIcon.classList.add("bi-x-lg");
  }
});
