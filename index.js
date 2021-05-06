import { getArtistData, getAlbumData } from "./utils.js"

const searchElement = document.getElementById("search")
const getArtistButton = document.getElementById("get-artist-button")
getArtistButton.addEventListener('click', () => getArtistData(searchElement))

getArtistData('Cher')

getAlbumData('Cher')    