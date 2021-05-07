import { getArtistData, getAlbumData, addBackgroundClass } from "./utils.js"

// Set constant for the input by the user that is exported as the data that is used in util.js
export const searchElement = document.getElementById("search")
    // define constant for button where user presses submit
export const getArtistButton = document.getElementById("get-artist-button")
    // Event listener that prevents code from refreshing the page and making the user input be null when the button is clicked
getArtistButton.addEventListener('click', function(event) { event.preventDefault() })
    // Event listener that will run the function getArtistData when the button is clicked
getArtistButton.addEventListener('click', getArtistData)

getArtistButton.addEventListener('click', addBackgroundClass)