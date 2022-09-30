let showId;
let allShows = [];
let allEpisodes = [];

async function fetchAllShows() {
  const response = await fetch (`https://api.tvmaze.com/shows`);
  const data = await response.json();
  // console.log("fetchAllShows function ran:");
  // console.log(data);
  return data;
}

async function fetchAllEpisodes(showId) {
  // if the default option (with value "none") is chosen on showSelect
  // then clear the allEpisodes array and reset the container
  if (showId === "none") {
    allEpisodes = [];
    searchReset();
  } else {
    const response = await fetch (`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    // console.log("fetchAllEpisodes function ran:");
    // console.log(data);
    return data;
  }
}

async function setup() {
  allShows = await fetchAllShows();
  createAppContainer();
  createHeaderContainer();
  createTitleContainer();
  createFunctionalityContainer();
  createShowSelect();
  populateShowSelect(allShows);
  createEpisodeSelect();
  populateEpisodeSelect(allEpisodes);
  createSearchInput();
  createSearchResetButton();
  createSearchResultsInfoContainer(allEpisodes);
  createEpisodesContainer();
  createFooter();
}

function createAppContainer() {
  const appContainer = document.createElement("div");
  appContainer.classList.add("app-container");

  document.body.append(appContainer);
}

function createHeaderContainer() {
  const headerContainer = document.createElement("header");
  headerContainer.classList.add("header-container");
  
  document.querySelector(".app-container").appendChild(headerContainer);
  // return headerContainer;
}

function createTitleContainer() {
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  const titleImage = document.createElement("img");
  titleImage.classList.add("title-image");
  titleImage.src = "tv.png";

  const titleHeading = document.createElement("h1");
  titleHeading.classList.add("title-heading");
  titleHeading.textContent = "TV Show DOM Project";

  titleContainer.appendChild(titleImage);
  titleContainer.appendChild(titleHeading);

  document.querySelector(".header-container").appendChild(titleContainer);
  // return titleContainer;
}

function createFunctionalityContainer() {
  const functionalityContainer = document.createElement("div");
  functionalityContainer.classList.add("functionality-container");

  document.querySelector(".header-container").appendChild(functionalityContainer);
  // return functionalityContainer;
}

function createShowSelect() {
  const showSelect = document.createElement("select");
  showSelect.classList.add("show-select");
  showSelect.addEventListener("change", selectSpecificShow);

  const defaultShowSelectOption = document.createElement("option");
  defaultShowSelectOption.textContent = "Select a specific show...";
  defaultShowSelectOption.value = "none";
  showSelect.appendChild(defaultShowSelectOption);

  document.querySelector(".functionality-container").appendChild(showSelect);
  // return showSelect;
}

async function selectSpecificShow(event) {
  const specificShowId = event.target.value;
  // console.log(specificShowId);
  allEpisodes = await fetchAllEpisodes(specificShowId);
  populateEpisodeSelect(allEpisodes);
  searchReset();
}

function populateShowSelect(showsArray) {
  const showSelect = document.querySelector(".show-select");

  if (showsArray) {
    showsArray.forEach(element => {
      const selectOption = document.createElement("option");
      selectOption.classList.add("show-select-option");
      selectOption.textContent = element.name;
      // set the value to the id for easy identification later
      selectOption.value = element.id;
      showSelect.appendChild(selectOption);
    })
  }
}

function clearShowSelect() {
  // to do
}

function createEpisodeSelect() {
  const episodeSelect = document.createElement("select");
  episodeSelect.classList.add("episode-select");
  episodeSelect.addEventListener("change", selectSpecificEpisode);

  const defaultEpisodeSelectOption = document.createElement("option");
  defaultEpisodeSelectOption.textContent = "Select a specific episode...";
  // provide the default option a value of "none", i tried this with a value of -1 and it had really weird behaviour when conditionally checked(???)
  defaultEpisodeSelectOption.value = "none";
  episodeSelect.appendChild(defaultEpisodeSelectOption);

  document.querySelector(".functionality-container").appendChild(episodeSelect);
  // return episodeSelect;
}

function selectSpecificEpisode(event) {
  const specificEpisodeId = event.target.value;
  // console.log(specificEpisodeId);
  if (specificEpisodeId === "none") {
    searchReset();
  } else {
    let filteredEpisodes = allEpisodes.filter(element => element.id === Number(specificEpisodeId));
    clearEpisodesContainer();
    populateEpisodes(filteredEpisodes);
    updateSearchResultsInfo(filteredEpisodes.length, allEpisodes.length);
  }
}

function populateEpisodeSelect(episodesArray) {
  const episodeSelect = document.querySelector(".episode-select");
  clearEpisodeSelect();
  if (episodesArray) {
    episodesArray.forEach(element => {
      const selectOption = document.createElement("option");
      selectOption.classList.add("episode-select-option");
      selectOption.textContent = `${element.name} - S${element.season < 10 ? `0${element.season}` : element.season}${element.number < 10 ? `0${element.number}` : element.number}`
      // set the value to the id for easy identification later
      selectOption.value = element.id;
      episodeSelect.appendChild(selectOption);
    });
  }
}

function clearEpisodeSelect() {
  const episodeSelect = document.querySelector(".episode-select");
  // console.log(episodeSelect.childNodes.length);
  while (episodeSelect.childNodes.length > 1) {
    episodeSelect.removeChild(episodeSelect.lastChild);
  }
}

function createSearchInput() {
  const searchInput = document.createElement("input");
  searchInput.classList.add("search-input");
  searchInput.placeholder = "Search..."
  searchInput.addEventListener("input", searchWithInput);

  document.querySelector(".functionality-container").appendChild(searchInput);
  // return searchInput;
}

function searchWithInput(event) {
  const searchTerm = event.target.value;
  // console.log(searchTerm);
  if (searchTerm === "") {
    searchReset();
  } else {
    let filteredEpisodes = allEpisodes.filter(element => element.name.toLowerCase().includes(searchTerm.toLowerCase()) || element.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    clearEpisodesContainer();
    populateEpisodes(filteredEpisodes);
    updateSearchResultsInfo(filteredEpisodes.length, allEpisodes.length);
  }
}

function createSearchResetButton() {
  const searchResetButton = document.createElement("button");
  searchResetButton.classList.add("search-reset-button");
  searchResetButton.textContent = "Reset";
  searchResetButton.addEventListener("click", searchReset);

  document.querySelector(".functionality-container").appendChild(searchResetButton);
  // return searchResetButton;
}

function searchReset() {
  updateSearchResultsInfo(allEpisodes.length, allEpisodes.length);
  clearEpisodesContainer();
  populateEpisodes(allEpisodes);
  document.querySelector(".search-input").value = "";
}

function createSearchResultsInfoContainer(episodesArray) {
  const searchResultsInfoContainer = document.createElement("div");
  searchResultsInfoContainer.classList.add("search-results-info-container");

  const searchResultsInfoSpanOne = document.createElement("span");
  searchResultsInfoSpanOne.classList.add("search-results-info-span-one");
  searchResultsInfoSpanOne.textContent = "Displaying";

  const searchResultsInfoSpanTwo = document.createElement("span");
  searchResultsInfoSpanTwo.classList.add("search-results-info-span-two");
  searchResultsInfoSpanTwo.textContent = episodesArray.length;

  const searchResultsInfoSpanThree = document.createElement("span");
  searchResultsInfoSpanThree.classList.add("search-results-info-span-three");
  searchResultsInfoSpanThree.textContent = "/";

  const searchResultsInfoSpanFour = document.createElement("span");
  searchResultsInfoSpanFour.classList.add("search-results-info-span-four");
  searchResultsInfoSpanFour.textContent = episodesArray.length;

  const searchResultsInfoSpanFive = document.createElement("span");
  searchResultsInfoSpanFive.classList.add("search-results-info-span-five");
  searchResultsInfoSpanFive.textContent = "episodes.";

  searchResultsInfoContainer.appendChild(searchResultsInfoSpanOne);
  searchResultsInfoContainer.appendChild(searchResultsInfoSpanTwo);
  searchResultsInfoContainer.appendChild(searchResultsInfoSpanThree);
  searchResultsInfoContainer.appendChild(searchResultsInfoSpanFour);
  searchResultsInfoContainer.appendChild(searchResultsInfoSpanFive);

  document.querySelector(".functionality-container").appendChild(searchResultsInfoContainer);
  // return searchResultsInfoContainer;
}

function updateSearchResultsInfo(filteredEpisodesLength, totalEpisodesLength) {
  document.querySelector(".search-results-info-span-two").textContent = filteredEpisodesLength;
  document.querySelector(".search-results-info-span-four").textContent = totalEpisodesLength;
}

function createEpisodesContainer() {
  const episodesContainer = document.createElement("main");
  episodesContainer.classList.add("episodes-container");

  document.querySelector(".app-container").appendChild(episodesContainer);
  // return episodesContainer;
}

function populateEpisodes(episodesArray) {
  episodesArray.forEach(element => {
    const episodeContainer = document.createElement("div");
    episodeContainer.classList.add("episode-container");

    const episodeTitle = document.createElement("div");
    episodeTitle.classList.add("episode-title");
    episodeTitle.textContent = `${element.name} - S${element.season < 10 ? `0${element.season}` : element.season}${element.number < 10 ? `0${element.number}` : element.number}`

    const episodeBody = document.createElement("div");
    episodeBody.classList.add("episode-body");

    const episodeImage = document.createElement("img");
    episodeImage.classList.add("episode-image");
    episodeImage.src = element.image.medium; // toggle medium to original for full resolution

    const episodeSummary = document.createElement("div");
    episodeSummary.classList.add("episode-summary");
    // remove the hardcoded <p> and <br> tags, because i refuse to use innerHTML, and want to use textContent, Why? :
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations
    // "It is not uncommon to see innerHTML used to insert text into a web page.
    // There is potential for this to become an attack vector on a site, creating a potential security risk."
    element.summary = element.summary.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br>", "").replaceAll("</br>", "");
    episodeSummary.textContent = element.summary;

    episodeBody.appendChild(episodeImage);
    episodeBody.appendChild(episodeSummary);

    episodeContainer.appendChild(episodeTitle);
    episodeContainer.appendChild(episodeBody);

    document.querySelector(".episodes-container").appendChild(episodeContainer);
  });
}

function clearEpisodesContainer() {
  const episodesContainer = document.querySelector(".episodes-container");
  while (episodesContainer.firstChild) {
    episodesContainer.removeChild(episodesContainer.lastChild);
  }
}

function createFooter() {
  const footerContainer = document.createElement("footer");
  footerContainer.classList.add("footer-container");

  const footerSpanOne = document.createElement("span");
  footerSpanOne.classList.add("footer-span-one");
  footerSpanOne.textContent = "Data sourced from the";

  const footerSpanTwo = document.createElement("a");
  footerSpanTwo.classList.add("footer-span-two");
  footerSpanTwo.href = "https://www.tvmaze.com/api";
  footerSpanTwo.target = "_blank";
  footerSpanTwo.textContent = "TVMaze.com API";

  footerContainer.appendChild(footerSpanOne);
  footerContainer.appendChild(footerSpanTwo);

  document.querySelector(".app-container").appendChild(footerContainer);
}

window.onload = setup;