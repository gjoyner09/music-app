import { searchElement } from "./index.js"

// Variables defined to allow for access within function code blocks
let artistHeader = null
let artistPic = null
let artistName = null
let artistBio = null
let artistBioShort = null
let artistLink = null


// adds the background gray to the page when the user searches for their first artist
export function addBackgroundClass() {
    let searchDiv = document.getElementById("artist-info")
    let resultDiv = document.getElementById("search-results")
    searchDiv.classList.add("background-class")
    resultDiv.classList.add("background-class")
}

// Asynchronous function to getch music artist data from API
export async function getArtistData() {
    // variable to assign the value of the input by the user
    let artist = searchElement.value.replace('&', '%26').replace(' and ', ' %26 ')
        // Variable to assign the API fetch request, with interpolation of artist in the API URL
    let artistResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
        // Variable assiging the JSON data as an object
    let artistData = await artistResponse.json()
        // Function call to use the data retrieved to now display the values we want to show on the front-end
    displayArtistData(artistData)
        // ForEach loop that iterates through the similar artists array and iterates each similar artists through the displaySimilarData function
    artistData.artist.similar.artist.forEach((simArtist, index) => { displaySimilarData(simArtist, index) })
}

// Asynchronous function to retrieve the albums for the artist input
export async function getAlbumData(artist) {
    artist = artist.replace('&', '%26').replace(' and ', ' %26 ')
        // Variable to assign the API fetch request for the albums of the artist, with string interpolation in the API URL
    let albumResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
        // Variable assigning the JSON album data to an object
    let albumData = await albumResponse.json()
        // Returning the album data
    return albumData
}

// Asynchronous function to retrieve the album data for similar artists that the user initially searched for
// This function was needed to retrieve the album image
async function getSimilarAlbum(name) {
    name = name.replace('&', '%26').replace(' and ', ' %26 ')
        // Variable to assign the API fetch request for the top albums object, with string interpolation for the artist name
    let similarResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${name}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
        // Variable assigning the JSON similar album data as an object
    let similarData = await similarResponse.json()
        // Returning the similar albums data
    return similarData
}

// Asynchronous function to retrieve the artist data for the similar artists the user may like after searching for their initial artist
async function getSimilarData(name) {
    name = name.replace('&', '%26').replace(' and ', ' %26 ')
        // Variable to assign the API fetch request for the similar artists, with string inpterolation for the artist name
    let similarResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
        // Variable assigning the JSON similar artists data as an object
    let similarData = await similarResponse.json()
        // Returning the similar artists data
    return similarData
}

// Function that will display the specific data that will be displayed to the front-end
function displayArtistData(artistData) {
    // Try block that will execute if the artist name is found on the API database
    try {
        // Setting constant to access the artist information <div>
        const artistDiv = document.getElementById("artist-info")
            // If statement to make sure that the artist information div is currently empty
        if (artistDiv.children.length === 0) {
            // Creating the various elements that will be displayed to the front-end and appending them to the relative sections
            artistHeader = document.createElement("p")
            artistHeader.classList.add("header-p")
            artistHeader.id = "artist-header"
            artistDiv.appendChild(artistHeader)
            artistPic = document.createElement("img")
            artistPic.classList.add("artist-class")
            artistDiv.appendChild(artistPic)
            artistName = document.createElement("p")
            artistName.classList.add("artist-class")
            artistDiv.appendChild(artistName)
            artistBio = document.createElement("p")
            artistBio.classList.add("artist-class")
            artistBio.id = "long-bio"
            artistDiv.appendChild(artistBio)
            artistBioShort = document.createElement("p")
            artistBioShort.classList.add("artist-class")
            artistBioShort.id = "short-bio"
            artistDiv.appendChild(artistBioShort)
            artistLink = document.createElement("a")
            artistLink.classList.add("artist-class")
            artistDiv.appendChild(artistLink)
        }
        // adding the header for the searched artist section
        artistHeader.textContent = `If you like ${artistData.artist.name}...`
            // Calling to get the album data for the artist
        let albumData = getAlbumData(artistData.artist.name)
            // Fulfilling the promise with .then and subsequently allocating the src of the <img> tag with a link of the artists most popular album
        albumData.then(result => {
                artistPic.src = result.topalbums.album[0].image[3]["#text"]
            })
            // Creating text content for the artist's name
        artistName.textContent = artistData.artist.name
            // Creating text content for the artist's biography
            // artistBio.textContent = artistData.artist.bio.content
        if (artistData.artist.bio.content.length > 3000) {
            artistBio.textContent = artistData.artist.bio.content.slice(0, 3000)
            let space = artistData.artist.bio.content.indexOf(" ", 3000)
            artistBio.textContent += artistData.artist.bio.content.slice(3000, space)
            artistBio.textContent += " ..."
        } else {
            artistBio.textContent = artistData.artist.bio.content
        }
        // adding a short bio - this will only be displayed on mobile view
        if (artistData.artist.bio.content.length > 600) {
            artistBioShort.textContent = artistData.artist.bio.content.slice(0, 600)
            let space = artistData.artist.bio.content.indexOf(" ", 600)
            artistBioShort.textContent += artistData.artist.bio.content.slice(600, space)
            artistBioShort.textContent += " ..."
        } else {
            artistBio.textContent = artistData.artist.bio.content
        }
        // Allocating the url href for a link to the searched artist's url
        artistLink.href = artistData.artist.url
            // Allocating the text content for the link
        artistLink.textContent = "Learn more"
            // Catch block that will display an alert to the browser if the artist wasn't found
        artistLink.style.cssText = "font-size: 16px; background-color: blueviolet; border-radius: 20px; border: blueviolet 1px solid; color: white; margin-top: 1vw; width: 20vw; text-decoration: none; padding-left: 20px; padding-right: 20px; padding-top: 4px; padding-bottom: 4px"
    } catch (error) {
        // alert("Your artist was not found. Please try again.")
        console.log(error.message)
    }
}

// Function to display the data for the similar artists to the artist that was searched
// The API currently extracts an array of 5 artist objects and this function is being iterated in the ForEach loop in line 21
function displaySimilarData(simArtist, index) {
    // Setting constatnt that get retrieves the <div> with the id = 'search-results'
    const simDiv = document.getElementById("search-results")
        // Setting constant that retrieves the <div> for each individual similar artist suggestion
    const simHeader = document.getElementById("sim-artist-header")
        // Creating text content at the top of the div
    simHeader.textContent = "You may also like..."
        // Allocating a variable paragraph tag with the id having interpolation for the index of the array loop
    let simNameP = document.getElementById(`name${index}`)
        // Creating text content for the similar artists' name
    simNameP.textContent = simArtist.name
        // Allocating a variable image tag with the id having interpolation for the index of the array loop
    let simPicImg = document.getElementById(`pic${index}`)
        // Calling the getSimilarAlbum function to retrieve the album data for the similar data
    let simAlbumData = getSimilarAlbum(simArtist.name)
        // Using .then to fulfil the promise, and subsequently using the album image link as the image tag src
    simAlbumData.then(result => {
            simPicImg.src = result.topalbums.album[0].image[3]["#text"]
                // In the case where no image link is associated with that album, an if statement was used to then iterate to use the image of the next most popular album
            if (!result.topalbums.album[0].image[3]["#text"]) {
                simPicImg.src = result.topalbums.album[1].image[3]["#text"]
            }
        })
        // Allocating a variable for the biography <p> tag with interpolation based on the iteration of the array index
    let simBioP = document.getElementById(`bio${index}`)
        // Calling the getSimilarData function to retrieve the data for the similar artist suggestion
    let simArtistData = getSimilarData(simArtist.name)
        // Fulfilling the promise with .then and subsequently creating text content of the similar artists' biography content
        // If the bio is more than 700 characters, the text will stop at the first space after the 700th character and add "..." to the end
    simArtistData.then(result => {
            if (result.artist.bio.content.length > 600) {
                simBioP.textContent = result.artist.bio.content.slice(0, 600)
                let space = result.artist.bio.content.indexOf(" ", 600)
                simBioP.textContent += result.artist.bio.content.slice(600, space)
                simBioP.textContent += " ..."
            } else {
                simBioP.textContent = result.artist.bio.content
            }
        })
        // Allocating the variable for the <a> tag with interpolation based on the index of the similar artists array
    let simLinkA = document.getElementById(`a${index}`)
        // Allocating the href of the <a> tag to be the url of the similar artist's retrieved data
    simLinkA.href = simArtist.url
        // Setting the text for the link
    simLinkA.textContent = "Learn more"
    simLinkA.style.cssText = "font-size: 16px; background-color: blueviolet; border-radius: 20px; border: blueviolet 1px solid; color: white; margin-top: 1vw; width: 20vw; text-decoration: none; padding-left: 20px; padding-right: 20px; padding-top: 4px; padding-bottom: 4px"
}