const form = document.getElementById("search-form");
const searchBar = document.getElementById("search-bar");
const searchIcon = document.getElementById("search-icon");

const submitEvent = new Event("submit", { bubbles: true });

document.getElementById("search-button").addEventListener("click", function () {
  if (searchBar.classList.contains("expanded")) {
    searchBar.classList.remove("expanded");
    searchIcon.classList.remove("bi-x-lg");
    searchIcon.classList.add("bi-search");
    searchBar.value = "";
    form.dispatchEvent(submitEvent);
  } else {
    searchBar.classList.add("expanded");
    searchIcon.classList.remove("bi-search");
    searchIcon.classList.add("bi-x-lg");
  }
});
