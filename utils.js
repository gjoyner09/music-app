import { searchElement } from "./index.js"
let artistHeader = null
let artistPic = null
let artistBio = null
let artistName = null
let artistLink = null

export async function getArtistData() {
    let artist = searchElement.value
    let artistResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let artistData = await artistResponse.json()
    console.log(artistData)
    displayArtistData(artistData)
    artistData.artist.similar.artist.forEach((simArtist, index) => { displaySimilarData(simArtist, index) })
}

export async function getAlbumData(artist) {
    let albumResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let albumData = await albumResponse.json()
        // console.log(albumData)
    return albumData
}

async function getSimilarAlbum(name) {
    console.log("Name: " + name)
    let similarResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${name}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let similarData = await similarResponse.json()
    return similarData
}

async function getSimilarData(name) {
    let similarResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let similarData = await similarResponse.json()
    return similarData
}

function displayArtistData(artistData) {
    try {
        const artistDiv = document.getElementById("artist-info")
        if (artistDiv.children.length === 0) {
            artistHeader = document.createElement("p")
            artistDiv.appendChild(artistHeader)
            artistPic = document.createElement("img")
            artistDiv.appendChild(artistPic)
            artistName = document.createElement("p")
            artistDiv.appendChild(artistName)
            artistBio = document.createElement("p")
            artistDiv.appendChild(artistBio)
            artistLink = document.createElement("a")
            artistDiv.appendChild(artistLink)
        }
        artistHeader.textContent = `If you like ${artistData.artist.name}...`
        let albumData = getAlbumData(artistData.artist.name)
        albumData.then(result => {
            artistPic.src = result.topalbums.album[0].image[2]["#text"]
        })
        artistName.textContent = artistData.artist.name
        artistBio.textContent = artistData.artist.bio.content.slice(0, 500)
        artistLink.href = artistData.artist.url
        artistLink.textContent = "Link to artist on last.fm"
    } catch (iFuckedUp) {
        alert("Your artist was not found. Please try again.")
    }
}

function displaySimilarData(simArtist, index) {
    const simDiv = document.getElementById("search-results")
    const simHeader = document.getElementById("sim-artist-header")
    simHeader.textContent = "You may also like..."
        // let simArtistDiv = document.getElementById(`artist${index}`)
    let simNameP = document.getElementById(`name${index}`)
    simNameP.textContent = simArtist.name
    let simPicImg = document.getElementById(`pic${index}`)
    let simAlbumData = getSimilarAlbum(simArtist.name)
    console.log(simArtist.name)
    simAlbumData.then(result => {
        simPicImg.src = result.topalbums.album[0].image[2]["#text"]
        if (!result.topalbums.album[0].image[2]["#text"]) {
            simPicImg.src = result.topalbums.album[1].image[2]["#text"]
        }
    })
    let simBioP = document.getElementById(`bio${index}`)
    let simArtistData = getSimilarData(simArtist.name)
    simArtistData.then(result => {
        simBioP.textContent = result.artist.bio.content.slice(0, 500)
    })
    let simLinkA = document.getElementById(`a${index}`)
    simLinkA.href = simArtist.url
    simLinkA.textContent = "Link to artist on last.fm"
}