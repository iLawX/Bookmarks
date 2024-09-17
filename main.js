const title = document.querySelector(".title");
const url = document.querySelector(".url");
const categories = document.querySelector("select");
const userCategories = document.querySelector(".user-categories");
const categoryInput = document.querySelector(".category-value");
const addCategory = document.querySelector(".add-category");
const removeCategory = document.querySelector(".remove-category");
const addBookmark = document.querySelector(".add-bookmark");
const bookmarksFilter = document.querySelector(".bookmarks-filter");
const filter = document.querySelector(".filter");
const searchInput = document.querySelector(".search");
const searchFilter = document.querySelector(".filter-categories");
const bookmarks = document.querySelector(".bookmarks");

let filteredBookmarks;

let categoriesList = [
  "Education",
  "Fantasy",
  "Adventure",
  "Romance",
  "Horror",
  "Games",
];

let bookmarksList = [];

const alert = Swal.mixin({
  timer: 3000,
  timerProgressBar: true,
  confirmButtonColor: "#007ed9",
  showCloseButton: true,
});

document.forms[0].addEventListener("click", (e) => {
  e.preventDefault();
});

if (window.localStorage.getItem("categories")) {
  categoriesList = JSON.parse(window.localStorage.getItem("categories"));
} else {
  window.localStorage.setItem("categories", JSON.stringify(categoriesList));
}

showCategories();

// Save Category To Local Storage

function saveCategory() {
  window.localStorage.setItem("categories", JSON.stringify(categoriesList));
}

// Show Categories

function showCategories() {
  userCategories.innerHTML = "";
  categoriesList.forEach((option) => {
    userCategories.innerHTML += `
    <option>${option}</option>
    `;
  });
}
// Add Category

addCategory.addEventListener("click", () => {
  if (categoryInput.value !== "") {
    if (categoriesList.includes(categoryInput.value)) {
      alert.fire({
        icon: "error",
        title: "Category added already!",
      });
      categoryInput.value = "";
    } else {
      const category = categoryInput.value;
      categoriesList.push(category);
      showCategories();
      saveCategory();
      addFilterCategories();
      alert.fire({
        icon: "success",
        title: "Category added successfullly",
      });
      categories.value = categoryInput.value;
      categoryInput.value = "";
    }
  } else {
    alert.fire({
      icon: "error",
      title: "Type a valid category",
    });
  }
});

// Remove Category

removeCategory.addEventListener("click", () => {
  if (categoryInput.value !== "") {
    if (categoriesList.includes(categoryInput.value)) {
      const categoryIndex = categoriesList.indexOf(categoryInput.value);
      categoriesList.splice(categoryIndex, 1);
      saveCategory();
      showCategories();
      addFilterCategories();
      alert.fire({
        icon: "success",
        title: "Category removed successfully",
      });
      categoryInput.value = "";
    } else {
      alert.fire({
        icon: "error",
        title: "There is no category with that name!",
      });
    }
  } else {
    alert.fire({
      icon: "error",
      title: "Type a valid category",
    });
  }
});

// Save Bookmark To Local Storage

function saveBookmark() {
  window.localStorage.setItem("bookmarks", JSON.stringify(bookmarksList));
}

if (window.localStorage.getItem("bookmarks")) {
  bookmarksList = JSON.parse(window.localStorage.getItem("bookmarks"));
}

showBookmarksFrom(bookmarksList);

// Show Bookmarks

function showBookmarksFrom(list) {
  bookmarks.innerHTML = "";
  list.forEach((bookmark) => {
    bookmarks.innerHTML += `
      <div class="bookmark" id="${bookmark.id}">
        <span class="category-name">${bookmark.category}</span>
        <div class=link>
          <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
        </div>
        <button onclick="deleteBookmark(this)">Delete</button>
      </div>
    `;
  });
}

// Add Bookmark

function addBookmarks() {
  if (title.value !== "" && url.value !== "" && categories.value !== "") {
    const bookmark = {
      id: Date.now(),
      title: title.value,
      url: url.value,
      category: categories.value,
    };
    bookmarksList.push(bookmark);
    showBookmarksFrom(bookmarksList);
    saveBookmark();
    alert.fire({
      icon: "success",
      title: "Bookmark added successfully",
    });
    title.value = "";
    url.value = "";
    categories.value = "";
  } else {
    alert.fire({
      icon: "warning",
      title: "Please, fill in all inputs!",
    });
  }
}

// Delete Bookmark

function deleteBookmark(target) {
  bookmarksList = bookmarksList.filter(
    (bookmark) => bookmark.id !== +target.parentElement.getAttribute("id")
  );
  saveBookmark();
  if (searchInput.value === "" && filter.value === "All") {
    showBookmarksFrom(bookmarksList);
  } else if (searchInput.value !== "" && filter.value === "All") {
    filteredBookmarks = filteredBookmarks.filter(
      (bookmark) => bookmark.id !== +target.parentElement.getAttribute("id")
    );
    showBookmarksFrom(filteredBookmarks);
  } else {
    filteredBookmarks = filteredBookmarks.filter(
      (bookmark) => bookmark.id !== +target.parentElement.getAttribute("id")
    );
    showFilteredBookmarks();
  }
  checkBookmarks();
}

// Add Categories To Filter

function addFilterCategories() {
  searchFilter.innerHTML = "";
  const filterCategories = JSON.parse(
    window.localStorage.getItem("categories")
  );
  filterCategories.forEach((option) => {
    searchFilter.innerHTML += `
      <option>${option}</option>
    `;
  });
}
addFilterCategories();

// Filter Bookmarks

bookmarksFilter.addEventListener("input", () => {
  if (filter.value === "All") {
    filteredBookmarks = bookmarksList.filter((bookmark) =>
      bookmark.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    showBookmarksFrom(filteredBookmarks);
  } else {
    filteredBookmarks = bookmarksList.filter(
      (bookmark) =>
        bookmark.title
          .toLowerCase()
          .includes(searchInput.value.toLowerCase()) &&
        bookmark.category === filter.value
    );
    showFilteredBookmarks();
  }
  checkBookmarks();
});

// Show Filtered Bookmarks

function showFilteredBookmarks() {
  bookmarks.innerHTML = "";
  filteredBookmarks.forEach((bookmark, index) => {
    bookmarks.innerHTML += `
      <div class="bookmark" id="${bookmark.id}">
        <span class="number">${index + 1}</span>
        <div class=link>
          <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
        </div>
        <button  onclick="deleteBookmark(this)">Delete</button>
      </div>`;
  });
}

// Check Bookmarks

function checkBookmarks() {
  if (bookmarks.innerHTML === "") {
    bookmarks.innerHTML = `
      <div class="search-result">
        <svg width="100px" height="100px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 11.493C5.50364 8.39226 7.69698 5.72579 10.7388 5.12416C13.7807 4.52253 16.8239 6.15327 18.0077 9.0192C19.1915 11.8851 18.186 15.1881 15.6063 16.9085C13.0265 18.6288 9.59077 18.2874 7.4 16.093C6.18148 14.8725 5.49799 13.2177 5.5 11.493Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.062 16.568L19.5 19.993" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5303 8.96271C10.2374 8.66982 9.76256 8.66982 9.46967 8.96271C9.17678 9.25561 9.17678 9.73048 9.46967 10.0234L10.5303 8.96271ZM11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627L11.4697 12.0234ZM12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234L12.5303 10.9627ZM13.4697 14.0234C13.7626 14.3163 14.2374 14.3163 14.5303 14.0234C14.8232 13.7305 14.8232 13.2556 14.5303 12.9627L13.4697 14.0234ZM12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627L12.5303 12.0234ZM9.46967 12.9627C9.17678 13.2556 9.17678 13.7305 9.46967 14.0234C9.76256 14.3163 10.2374 14.3163 10.5303 14.0234L9.46967 12.9627ZM11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234L11.4697 10.9627ZM14.5303 10.0234C14.8232 9.73048 14.8232 9.25561 14.5303 8.96271C14.2374 8.66982 13.7626 8.66982 13.4697 8.96271L14.5303 10.0234ZM9.46967 10.0234L11.4697 12.0234L12.5303 10.9627L10.5303 8.96271L9.46967 10.0234ZM11.4697 12.0234L13.4697 14.0234L14.5303 12.9627L12.5303 10.9627L11.4697 12.0234ZM11.4697 10.9627L9.46967 12.9627L10.5303 14.0234L12.5303 12.0234L11.4697 10.9627ZM12.5303 12.0234L14.5303 10.0234L13.4697 8.96271L11.4697 10.9627L12.5303 12.0234Z" fill="#000000"/>
        </svg>
        <h3>Sorry, no results found!</h3>
      </div>
    `;
  }
}
checkBookmarks();
