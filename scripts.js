import { BOOKS_PER_PAGE, authors, genres, books } from './data.js'
let page = 1;
  

const openSettings = document.querySelector('[data-header-settings]')
const closeSettings = document.querySelector('[data-settings-cancel]')
const settingsOverlay = document.querySelector('[data-settings-overlay]')

const openSearch = document.querySelector('[data-header-search]')
const closeSearch = document.querySelector('[data-search-cancel]')
const searchOverlay = document.querySelector('[data-search-overlay]')


//Show genre list
const genreList = document.querySelector('[data-search-genres]')
const createGenreOptionsHTML = () => {
const fragGenre = document.createDocumentFragment()

for (const [id, value] of Object.entries(genres)) {
    const genreOption = document.createElement('option')
    genreOption.value = id;
    genreOption.innerText = value
    fragGenre.appendChild(genreOption);
}
return fragGenre;
}

genreList.appendChild(createGenreOptionsHTML())

//Show author list
const authorList = document.querySelector('[data-search-authors]')
const createAuthorOptionsHTML = () => {
const fragAuthor = document.createDocumentFragment()

for (const [id, value] of Object.entries(authors)) {
    const authorOption = document.createElement('option')
    authorOption.value = id;
    authorOption.innerText = value;
    fragAuthor.appendChild(authorOption);
}
return fragAuthor;
}
authorList.appendChild(createAuthorOptionsHTML())

// open/close settings overlay
const handleSettingsToggle = (event) => {
    if (settingsOverlay.style.display === 'block') {
        settingsOverlay.style.display = 'none';
    } else {
        settingsOverlay.style.display = 'block';
    }
}

// open/close search overlay
const handleSearchToggle = (event) => {
    if (searchOverlay.style.display === 'block') {
        searchOverlay.style.display = 'none';
    } else {
        searchOverlay.style.display ='block';
    }
     
}

openSettings.addEventListener('click', handleSettingsToggle)
closeSettings.addEventListener('click', handleSettingsToggle)
openSearch.addEventListener('click', handleSearchToggle)
closeSearch.addEventListener('click', handleSearchToggle)


/* Settings overlay */

const settingsTheme = document.querySelector('[data-settings-theme]')
const saveSettings = document.querySelector('[data-settings-form]')



const handleSettingsSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get the selected theme value from the dropdown
    const selectedTheme = settingsTheme.value;
  
    if (selectedTheme === 'night') {
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

    settingsOverlay.style.display = 'none';
    
}

saveSettings.addEventListener('submit', handleSettingsSubmit)


const openList = document.querySelector('[data-list-button]')

function updateButtonLabel() {
    openList.innerText = `Show more (${books.length - page * BOOKS_PER_PAGE > 0 ? books.length - [page * BOOKS_PER_PAGE] : 0})`
  }

/* search form filters */

const genreSelect = document.querySelector('[data-search-genres]');
const authorSelect = document.querySelector('[data-search-authors]');

// Function to add "All Genres" option to the genre select
function addAllGenresOption() {
  const allGenresOption = document.createElement('option');
  allGenresOption.value = 'any';
  allGenresOption.textContent = 'All Genres';
  genreSelect.appendChild(allGenresOption);
}

// Function to add "All Authors" option to the author select
function addAllAuthorsOption() {
  const allAuthorsOption = document.createElement('option');
  allAuthorsOption.value = 'any';
  allAuthorsOption.textContent = 'All Authors';
  authorSelect.appendChild(allAuthorsOption);
}

addAllGenresOption();
addAllAuthorsOption();


const searchForm = document.querySelector('[data-search-form]')
const itemsList = document.querySelector('[data-list-items]')
const noMatches = document.querySelector('[ data-list-message]')


const handleSearch = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)


    const filteredBooks = books.filter((book) => {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
    
        return titleMatch && authorMatch && genreMatch;
      })
    

    if (filteredBooks.length === 0) {
        noMatches.style.display = 'block'
        searchOverlay.style.display = 'none';
      } else {
        noMatches.style.display = 'none'
      }
    
      // Clear the itemsList
      itemsList.innerHTML = '';
    
      // Display the filtered books
      
      const fragment = document.createDocumentFragment();
    
      filteredBooks.forEach((book) => {
        const { author, image, title, id } = book;
        const authorName = authors[author]; // Get the author's name from the authors object
    
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = /* html */ `
          <img
            class="preview__image"
            src="${image}"
          />
          
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authorName}</div>
          </div>
        `;
    
        fragment.appendChild(element);
      });
    
      itemsList.appendChild(fragment);
      searchOverlay.style.display = 'none'
    
      openList.disabled = filteredBooks.length === 0;

      const initial = filteredBooks.length - (page * BOOKS_PER_PAGE);
      openList.disabled = !(initial > 0);
    
      // Scroll to the top
      window.scrollTo({ top: 0, behavior: 'smooth' });

}


searchForm.addEventListener('submit', handleSearch)

/** function to show 36 books per page and show 36 more as you click button */

const handleShowList = (event) => {
    const startIndex = page * BOOKS_PER_PAGE
    const endIndex = (page + 1) * BOOKS_PER_PAGE
    if (startIndex < books.length) {
    displayBooks(startIndex, endIndex);  
    page = page + 1    
} else openList.disabled = true;  
updateButtonLabel()
}

openList.addEventListener('click', handleShowList)

/**Function to display list of books */

function displayBooks(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex && i < books.length; i++) {
      const book = books[i];
      const { author, image, title, id } = book;
      const authorName = authors[author]; 
      const bookPreview = document.createElement('button');
      bookPreview.classList.add('preview');
      bookPreview.setAttribute('data-preview', id);
      
      bookPreview.innerHTML = `
      <img
      class="preview__image"
      src="${image}"
    />
    
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authorName}</div>
    </div>
  `;
      itemsList.appendChild(bookPreview);
    }
  }


/* Book preview */
const closePreview = document.querySelector('[data-list-close]')
const previewTitle = document.querySelector('[data-list-title]')
const previewSubtitle = document.querySelector('[data-list-subtitle]')
const previewDescription = document.querySelector('[data-list-description]')
//const previewBlur = document.querySelector('[data-list-blur]')
const previewImage = document.querySelector('[data-list-image]')
const activeOverlay = document.querySelector('[data-list-active]')

const handlePreviewToggle = (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null;

    for (let i = 0; i < pathArray.length; i++) {
        if (active) break;
        const { dataset } = pathArray[i];
        const previewId = dataset?.preview;
    
        if (previewId) {
            active = books.find((book) => book.id === previewId);
            break;
          }
        } 
    
 
    if (!active) return

    const { author, published, description, image, title } = active;

    activeOverlay.open = true;
    //previewBlur.src = image
    previewImage.src = image;
    previewTitle.textContent = title
    previewSubtitle.textContent = `${authors[author]} (${new Date(published).getFullYear()})`
    previewDescription.textContent = description;

}
closePreview.addEventListener('click', () => {
    if (activeOverlay.style.display === 'block') {
      activeOverlay.style.display = 'none'; 
    } else {
      activeOverlay.style.display = 'block';
    }
  });

itemsList.addEventListener('click', handlePreviewToggle)
closePreview.addEventListener('click', handlePreviewToggle)