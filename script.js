function createContainer(elementType, classList) {
  const container = document.createElement(`${elementType}`);
  container.classList.add(`${classList}`);
  return container;
}

function populateHeaderContainer(headerContainer) {
  const headerImage = document.createElement("img");
  headerImage.classList.add("header-image");
  headerImage.src = "images/tv.png";
  const headerTitle = document.createElement("h1");
  headerTitle.classList.add("header-title");
  headerTitle.textContent = "bazflix";
  headerContainer.appendChild(headerImage);
  headerContainer.appendChild(headerTitle);
}

function createSelectAndAddEventListener(classList, eventListenerFunction) {
  const select = document.createElement("select");
  select.classList.add(classList);
  select.addEventListener("change", eventListenerFunction);
  return select;
}

function createDefaultSelectOptionAndAppendToSelect(selectElement, classList, textContent) {
  const defaultShowSelectOption = document.createElement("option");
  defaultShowSelectOption.classList.add(classList);
  defaultShowSelectOption.textContent = textContent;
  // provide the default option a value of "none", i tried this with a value of -1 and it had really weird behaviour when conditionally checked(???)
  defaultShowSelectOption.value = "none";
  selectElement.append(defaultShowSelectOption);
}


function populateShowSelect(selectElement, showsArray) {
  showsArray.forEach(element => {
      const selectOption = document.createElement("option");
      selectOption.classList.add("show-select-option");
      selectOption.textContent = element.name;
      // set the value to show id
      selectOption.value = element.id;
      selectElement.appendChild(selectOption);
  });
}

function populateSeasonSelect(selectElement, seasonsArray) {
  seasonsArray.forEach(element => {
    const selectOption = document.createElement("option");
    selectOption.classList.add("season-select-option");
    selectOption.textContent = `Season ${element.number > 10 ? element.number : `0${element.number}`}`;
    // set the value to the season number
    selectOption.value = element.number;
    selectElement.appendChild(selectOption);
  });
}

function populateEpisodeSelect(selectElement, episodesArray) {
  episodesArray.forEach(element => {
      const selectOption = document.createElement("option");
      selectOption.classList.add("episode-select-option");
      selectOption.textContent = `${element.name} - S${element.season < 10 ? `0${element.season}` : element.season}${element.number < 10 ? `0${element.number}` : element.number}`
      // set the value to the episode id
      selectOption.value = element.id;
      selectElement.appendChild(selectOption);
  });
}

async function fetchAllShows() {
  console.log("fetchAllShows function ran");
  const response = await fetch(`https://api.tvmaze.com/shows`);
  const data = await response.json();
  // console.log(data);
  return data;
}

async function fetchAllSeasons(showId) {
  console.log("fetchAllSeasons function ran");
  if (showId === "none") {
    return [];
  } else {
    const response = await fetch (`https://api.tvmaze.com/shows/${showId}/seasons`);
    const data = await response.json();
    // console.log(data);
    return data;
  }
}

async function fetchAllEpisodes(showId) {
  console.log("fetchAllEpisodes function ran");
  if (showId === "none") {
    return [];
  } else {
    const response = await fetch (`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    // console.log(data);
    return data;
  }
}

function populateShowsContainer(showsContainer, showsArray) {
	showsArray.forEach((element, index) => {
    // if (index < 6) {
      const showContainer = document.createElement("div");
      showContainer.classList.add("show-container");

      // first idea:
      // provide the container the show Id in attribute data-id
      // showContainer.dataset.id = element.id;
      
      // second idea:
      // pass the id directly through to the event
      const showId = element.id;
      showContainer.addEventListener("click", () => triggerOnShowClick(showId));

      const showImage = document.createElement("img");
      showImage.classList.add("show-image");
      showImage.src = element.image.medium;

      const showInfoContainer = document.createElement("div");
      showInfoContainer.classList.add("show-info-container");

      const showTitle = document.createElement("h2");
      showTitle.classList.add("show-title");
      showTitle.textContent = element.name;

      const showGenres = document.createElement("span");
      showGenres.classList.add("show-genres");
      showGenres.textContent = "Genres : "
      element.genres.forEach((element, index, array) => {
        index < array.length -1 ? showGenres.textContent += `${element}, ` : showGenres.textContent += `${element}`
      });
		
      const showSummary = document.createElement("p");
      showSummary.classList.add("show-summary");
      // showSummary.innerHTML = element.summary;
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations
      // "It is not uncommon to see innerHTML used to insert text into a web page.
      // There is potential for this to become an attack vector on a site, creating a potential security risk."
      showSummary.textContent = shortenText(removeTagsFromText(element.summary), 200);
      
      const showPremiered = document.createElement("span");
      showPremiered.classList.add("show-premiered");
      showPremiered.textContent = element.premiered;
      showPremiered.textContent = `Premiered: ${convertDate(element.premiered)}`

      const showRating = document.createElement("span");
      showRating.classList.add("show-rating");
      showRating.textContent = `Rating : ${element.rating.average}`;

      showContainer.appendChild(showImage);
      showContainer.appendChild(showTitle);
      showContainer.appendChild(showRating);
      showContainer.appendChild(showGenres);
      showContainer.appendChild(showSummary);
      showContainer.appendChild(showPremiered);

      if (element.ended) {
        const showEnded = document.createElement("span");
        showEnded.classList.add("show-ended");
        showEnded.textContent = `Ended: ${convertDate(element.ended)}`;
        showContainer.appendChild(showEnded);
      }

      showsContainer.appendChild(showContainer);
  	// }
  });
}

function populateSeasonsContainer(seasonsContainer, seasonsArray) {
  seasonsArray.forEach((element) => {
    const seasonContainer = document.createElement("div");
    seasonContainer.classList.add("season-container");

    const seasonNumber = element.number;
    seasonContainer.addEventListener("click", () => triggerOnSeasonClick(seasonNumber));

    const seasonTitle = document.createElement("span");
    seasonTitle.classList.add("season-title");
    seasonTitle.textContent = `Season ${element.number > 10 ? element.number : `0${element.number}`}`;

    const seasonImage = document.createElement("img");
    seasonImage.classList.add("season-image");
    seasonImage.src = element.image.medium;

    seasonContainer.appendChild(seasonTitle);
    seasonContainer.appendChild(seasonImage);

    seasonsContainer.appendChild(seasonContainer);
  });
}

function populateEpisodesContainer(episodesContainer, episodesArray) {
  episodesArray.forEach((element, index) => {
    // if (index < 6) {
      const episodeContainer = document.createElement("div");
      episodeContainer.classList.add("episode-container");
  
      const episodeTitle = document.createElement("span");
      episodeTitle.classList.add("episode-title");
      episodeTitle.textContent = `S${element.season < 10 ? `0${element.season}` : element.season}${element.number < 10 ? `0${element.number}` : element.number} : ${element.name}`
  
      const episodeImage = document.createElement("img");
      episodeImage.classList.add("episode-image");
      episodeImage.src = element.image.medium; // toggle medium to original for full resolution
  
      const episodeSummary = document.createElement("p");
      episodeSummary.classList.add("episode-summary");
      // episodeSummary.innerHTML = element.summary;
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations
      // "It is not uncommon to see innerHTML used to insert text into a web page.
      // There is potential for this to become an attack vector on a site, creating a potential security risk."
      episodeSummary.textContent = shortenText(removeTagsFromText(element.summary), 200);
  
      episodeContainer.appendChild(episodeTitle);
      episodeContainer.appendChild(episodeImage);
      episodeContainer.appendChild(episodeSummary);
  
      episodesContainer.appendChild(episodeContainer);
    // }
  });
}

async function triggerOnShowSelect(event) {

  const showsContainer = document.querySelector(".shows-container");
  clearElement(showsContainer);

  const seasonsContainer = document.querySelector(".seasons-container");
  clearElement(seasonsContainer);

  const episodesContainer = document.querySelector(".episodes-container");
  clearElement(episodesContainer);

  const seasonSelect = document.querySelector(".season-select");
  clearElement(seasonSelect);
  createDefaultSelectOptionAndAppendToSelect(seasonSelect, "season-select-option", "Select a Season");

  const episodeSelect = document.querySelector(".episode-select");
  clearElement(episodeSelect);
  createDefaultSelectOptionAndAppendToSelect(episodeSelect, "episode-select-option", "Select an Episode");
  
  const specificShowId = event.target.value;
  // console.log(showId);

  if (specificShowId === "none") {
    populateShowsContainer(showsContainer, allShows);
  } else {
    filteredShows = allShows.filter(element => element.id === Number(specificShowId));
    // console.log(filteredShows);
    populateShowsContainer(showsContainer, filteredShows);

    allSeasons = await fetchAllSeasons(specificShowId);
    populateSeasonsContainer(seasonsContainer, allSeasons);

    populateSeasonSelect(seasonSelect, allSeasons);

    // we need to get the episodes here so we can use them in Season later
    allEpisodes = await fetchAllEpisodes(specificShowId);
    // console.log(allEpisodes);
  }
}

function triggerOnSeasonSelect(event) {

  console.log(allShows);
  console.log(allSeasons);
  console.log(allEpisodes);
  console.log(filteredShows);
  console.log(filteredSeasons);
  console.log(filteredEpisodes);

  const seasonsContainer = document.querySelector(".seasons-container");
  clearElement(seasonsContainer);
  
  const episodesContainer = document.querySelector(".episodes-container");
  clearElement(episodesContainer);

  const episodeSelect = document.querySelector(".episode-select");
  clearElement(episodeSelect);
  createDefaultSelectOptionAndAppendToSelect(episodeSelect, "episode-select-option", "Select an Episode");

  const specificSeasonId = event.target.value;
  // console.log(specificSeasonId);

  if (specificSeasonId === "none") {
    populateSeasonsContainer(seasonsContainer, allSeasons);
  } else {
    filteredSeasons = allSeasons.filter(element => element.number === Number(specificSeasonId));
    populateSeasonsContainer(seasonsContainer, filteredSeasons);

    filteredEpisodes = allEpisodes.filter(element => element.season === Number(specificSeasonId));
    populateEpisodesContainer(episodesContainer, filteredEpisodes);

    populateEpisodeSelect(episodeSelect, filteredEpisodes);
  }
}

function triggerOnEpisodeSelect(event) {
	const specificEpisodeId = event.target.value;
  console.log(specificEpisodeId);
	const episodesContainer = document.querySelector(".episodes-container");
	clearElement(episodesContainer);
	if (specificEpisodeId === "none") {
		populateEpisodesContainer(episodesContainer, allEpisodes);
	} else {
		filteredEpisodes = allEpisodes.filter(element => element.id === Number(specificEpisodeId));
		populateEpisodesContainer(episodesContainer, filteredEpisodes);
	}
}

// CLICKING ON SHOW CONTAINER 
async function triggerOnShowClick(showId) {

  console.log(showId);

  allSeasons = await fetchAllSeasons(showId);
  allEpisodes = await fetchAllEpisodes(showId);

  const showsContainer = document.querySelector(".shows-container");
  clearElement(showsContainer);
  filteredShows = allShows.filter(element => element.id === Number(showId));
  populateShowsContainer(showsContainer, filteredShows);

  const seasonsContainer = document.querySelector(".seasons-container");
  clearElement(seasonsContainer);
  populateSeasonsContainer(seasonsContainer, allSeasons);

  const episodesContainer = document.querySelector(".episodes-container");
  clearElement(episodesContainer);

  const showSelect = document.querySelector(".season-select");
  // reflect in the select box, set the select option to the specific show... how?

  const seasonSelect = document.querySelector(".season-select");
  clearElement(seasonSelect);
  createDefaultSelectOptionAndAppendToSelect(seasonSelect, "season-select-option", "Select a Season");

  const episodeSelect = document.querySelector(".episode-select");
  clearElement(episodeSelect);
  createDefaultSelectOptionAndAppendToSelect(episodeSelect, "episode-select-option", "Select an Episode"); 

}

function triggerOnSeasonClick(seasonNumber) {

  // if already clicked, clear the episodesContainer
  // if not clicked then populate the episodesContainer

  console.log(seasonNumber);

  const seasonsContainer = document.querySelector(".seasons-container");
  clearElement(seasonsContainer);
  filteredSeasons = allSeasons.filter(element => element.number === seasonNumber);
  populateSeasonsContainer(seasonsContainer, filteredSeasons);

  const episodesContainer = document.querySelector(".episodes-container");
  clearElement(episodesContainer);
  filteredEpisodes = allEpisodes.filter(element => element.season === seasonNumber);
  populateEpisodesContainer(episodesContainer, filteredEpisodes);
}

function triggerOnEpisodeClick(showId) {
  console.log(showId);
}

function createResetSelectionButton() {
  const resetButton = document.createElement("button");
  resetButton.classList.add("reset-selection-button");
  resetButton.textContent = "Reset Selection";
  resetButton.addEventListener("click", triggerOnResetSelectionButton);
  return resetButton;
}

function triggerOnResetSelectionButton() {
  const showsContainer = document.querySelector(".shows-container");
  clearElement(showsContainer);
  
  const seasonsContainer = document.querySelector(".seasons-container");
  clearElement(seasonsContainer);

  const episodesContainer = document.querySelector(".episodes-container");
  clearElement(episodesContainer);

  populateShowsContainer(showsContainer, allShows);

  const showSelect = document.querySelector(".show-select");
  clearElement(showSelect);
  createDefaultSelectOptionAndAppendToSelect(showSelect, "show-select-option", "Select a Show");

  const seasonSelect = document.querySelector(".season-select");
  clearElement(seasonSelect);
  createDefaultSelectOptionAndAppendToSelect(seasonSelect, "season-select-option", "Select a Season");

  const episodeSelect = document.querySelector(".episode-select");
  clearElement(episodeSelect);
  createDefaultSelectOptionAndAppendToSelect(episodeSelect, "episode-select-option", "Select an Episode"); 

  populateShowSelect(showSelect, allShows);
}


// SEARCH FUNCTIONALITY STARTS HERE
function createSearchShowInput() {
  const searchShowInput = document.createElement("input");
  searchShowInput.classList.add("search-show-input");
  searchShowInput.placeholder = "Search for a Show"
  searchShowInput.addEventListener("input", triggerOnSearchShowInput);
  return searchShowInput;
}

function triggerOnSearchShowInput(event) {
  const searchTerm = event.target.value;
  console.log(searchTerm);

  const showsContainer = document.querySelector(".shows-container");
  const seasonsContainer = document.querySelector(".seasons-container");
  const episodesContainer = document.querySelector(".episodes-container");
  
  clearElement(showsContainer);
  clearElement(seasonsContainer);
  clearElement(episodesContainer);

  if (searchTerm === "") {
    // reset the showsContainer
    populateShowsContainer(showsContainer, allShows);
  } else {
    filteredShows = allShows.filter(element => element.name.toLowerCase().includes(searchTerm.toLowerCase()) || element.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    populateShowsContainer(showsContainer, filteredShows);

    // updateSearchResultsInfo(filteredEpisodes.length, allEpisodes.length);
  }
}

function createSearchEpisodeInput() {
  const searchEpisodeInput = document.createElement("input");
  searchEpisodeInput.classList.add("search-episode-input");
  searchEpisodeInput.placeholder = "Search for an Episode"
  searchEpisodeInput.addEventListener("input", triggerOnSearchEpisodeInput);
  return searchEpisodeInput;
}

function triggerOnSearchEpisodeInput(event) {

  // need to check here if the 
  if (searchTerm === "" && filteredShows.length !== 1) {
    // to do 

  }

  // if the filteredShows is not equal to 1 then don't do anything,
  // because this means we have not reduced it down to one show,
  //  we can't search the episodes across multiple shows.

  else {
    const searchTerm = event.target.value;
    console.log(searchTerm);

    const showsContainer = document.querySelector(".shows-container");
    const seasonsContainer = document.querySelector(".seasons-container");
    const episodesContainer = document.querySelector(".episodes-container");  
    clearElement(showsContainer);
    clearElement(seasonsContainer);
    clearElement(episodesContainer);

      if (searchTerm === "") {
        populateEpisodesContainer(episodesContainer, allShows);
      } else {
        console.log(allEpisodes);
        filteredEpisodes = allEpisodes.filter(element => element.name.toLowerCase().includes(searchTerm.toLowerCase()) || element.summary.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log(filteredEpisodes);
        populateShowsContainer(showsContainer, filteredShows);
        populateEpisodesContainer(episodesContainer, filteredEpisodes);
      }

  }
}

function clearElement(element) {
  while (element.childNodes.length > 0) {
      element.removeChild(element.lastChild);
  }
}

function toggleVisibility(element) {
  if (element.styles.display !== "none") {
    element.styles.display = "none";
  } else {
    element.styles.display = "block";
  }
}

function convertDate(date) {
	return date.split("-").reverse().join("/");
}

function removeTagsFromText(text) {
  return text
  .replaceAll("<p>", "")
  .replaceAll("</p>", "")
  .replaceAll("<br>", "")
  .replaceAll("</br>", "")
  .replaceAll("<b>", "")
  .replaceAll("</b>", "")
  .replaceAll("<i>", "")
  .replaceAll("</i>", "");
}

function shortenText(text, lengthCap) {
  if (text.length > lengthCap) {
    return text.slice(0, lengthCap) + "...";
  } else {
    return text;
  }
}

async function buildInitialPage() {

  const headerContainer = createContainer("div", "header-container");
  populateHeaderContainer(headerContainer);

  const functionalityContainer = createContainer("div", "functionality-container");
	
  const showSelect = createSelectAndAddEventListener("show-select", triggerOnShowSelect);
	createDefaultSelectOptionAndAppendToSelect(showSelect, "show-select-option", "Select a Show");

  const seasonSelect = createSelectAndAddEventListener("season-select", triggerOnSeasonSelect);
  createDefaultSelectOptionAndAppendToSelect(seasonSelect, "season-select-option", "Select a Season");
  
  const episodeSelect = createSelectAndAddEventListener("episode-select", triggerOnEpisodeSelect);
	createDefaultSelectOptionAndAppendToSelect(episodeSelect, "episode-select-option", "Select an Episode");

  const resetButton = createResetSelectionButton();

  const searchShowInput = createSearchShowInput();
  const searchEpisodeInput = createSearchEpisodeInput();

	functionalityContainer.append(showSelect);
  functionalityContainer.append(seasonSelect);
	functionalityContainer.append(episodeSelect);
  functionalityContainer.append(resetButton);
  functionalityContainer.append(searchShowInput);
  functionalityContainer.append(searchEpisodeInput);

  const mainContainer = createContainer("div", "main-container");
  const showsContainer = createContainer("div", "shows-container");
  const seasonsContainer = createContainer("div", "seasons-container");
  const episodesContainer = createContainer("div", "episodes-container");
  mainContainer.append(showsContainer);
  mainContainer.append(seasonsContainer);
  mainContainer.append(episodesContainer);

  const appContainer = createContainer("div", "app-container");
	appContainer.append(headerContainer);
	appContainer.append(functionalityContainer);
  appContainer.append(mainContainer);

	document.body.append(appContainer);

	allShows = await fetchAllShows();
	populateShowsContainer(showsContainer, allShows);
	populateShowSelect(showSelect, allShows);
}

let allShows = [];
let allSeasons = [];
let allEpisodes = [];

let filteredShows = [];
let filteredSeasons = [];
let filteredEpisodes = [];

window.onload = buildInitialPage;