// import episodes from './episodes.json' assert {type: 'json'};
// ^firefox doesnt like this


// LAYOUT OF DATA :
// id: 4952,
// url: "http://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming",
// name: "Winter is Coming",
// season: 1,
// number: 1,
// airdate: "2011-04-17",
// airtime: "21:00",
// airstamp: "2011-04-18T01:00:00+00:00",
// runtime: 60,
// image: {
//   medium:
//     "http://static.tvmaze.com/uploads/images/medium_landscape/1/2668.jpg",
//   original:
//     "http://static.tvmaze.com/uploads/images/original_untouched/1/2668.jpg",
// },
// summary: "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend, King Robert Baratheon, to serve as the King's Hand. Eddard reluctantly agrees after learning of a possible threat to the King's life. Eddard's bastard son Jon Snow must make a painful decision about his own future, while in the distant east Viserys Targaryen plots to reclaim his father's throne, usurped by Robert, by selling his sister in marriage.</p>",
// _links: {
//   self: {
//     href: "http://api.tvmaze.com/episodes/4952",
//   },
// },


function fetchEpisodes() {

  let returnArray;

  fetch(`https://api.tvmaze.com/shows/82/episodes`)
    .then((response) => response.json())
    .then((data) => returnArray = data)
    .catch((error) => console.log(error));

  console.log(returnArray);
  return returnArray;

}

fetchEpisodes();


async function fetchEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  const episodes = await response.json();
  console.log(episodes);
  return episodes;
}

fetchEpisodes();