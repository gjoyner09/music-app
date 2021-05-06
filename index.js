import { getArtistData, getAlbumData } from "./utils.js"

export const searchElement = document.getElementById("search")
export const getArtistButton = document.getElementById("get-artist-button")
console.log(getArtistButton)
getArtistButton.addEventListener('click', function(event) { event.preventDefault() })
getArtistButton.addEventListener('click', getArtistData)

// getArtistData('Cher')

// getAlbumData('Cher')