import { searchElement } from "./index.js"

export async function getArtistData() {
    console.log("i'm in the function")
    let artist = searchElement.value
    console.log("artist: " + artist)
    let artistResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let artistData = await artistResponse.json()
    console.log(artistData)
    return artistData
}

export async function getAlbumData(artist) {
    let albumResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=ecab99fdbdb2172b0d9570b823600f51&format=json`)
    let albumData = await albumResponse.json()
    console.log(albumData)
    return albumData
}