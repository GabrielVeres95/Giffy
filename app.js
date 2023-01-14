
// 1. When we search show the loading spinner (by adding a class to body)
// 2. When succesfull, change the loading hint to say 'see more'
// 3. Show error if fails

document.getElementById("input-field").focus();

const API_KEY = 'vycQre5Dgyf6CqIG55QnhJ2rEQXGX6Am'
const videosElement = document.querySelector('.videos')
const searchElement = document.querySelector('.search-input')
const inputField = document.getElementById("input-field")
const hintElement = document.querySelector('.search-hint')
const clearElement = document.querySelector('.search-clear')


const randomChoice = array => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}


function createVideo(src) {

  const video = document.createElement('video')

  video.src = src
  video.autoplay = true
  video.muted = true
  video.loop = true
  video.className = 'video full-area'

  return video
}


// Functia de cautare pe Giphy
const searchGiphy = searchTerm => {

  toggleLoading(true)

  // Cautarea de pe Giphy si introducerea termenului de cautare
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`).then(response => { 
    
    // Convert to JSON
    return response.json();
  
  }).then(gifs => {
    
    // convertim json in JS object cu numele gifs
    const gif = randomChoice(gifs.data)
    const src = gif.images.original.mp4
    
    const video = createVideo(src)
    videosElement.appendChild(video)

    // here we listen for the video loaded event to fire
    video.addEventListener('loadeddata', event => {

      video.classList.add('visible')
      toggleLoading(false)
      document.body.classList.add('has-results')
      hintElement.innerHTML = `Hit enter to search for more ${searchTerm}`

    })

  }).catch(error => {
  
    toggleLoading(false)
    // Modificare hint text
    hintElement.innerHTML = `Nothing was found for ${searchTerm}!`
  
  })
}

const toggleLoading = state => {

  if(state) {
    document.body.classList.add('loading')
    inputField.disabled = true
  } else {
    document.body.classList.remove('loading')
    inputField.disabled = false
    document.getElementById("input-field").focus()
  }

}


const doSearch = event => {

  const searchTerm = searchElement.value

  if (searchTerm.length > 2) {

    document.body.classList.add('show-hint')
    hintElement.innerHTML = `Hit enter to search for ${searchTerm}`

  } else {

    document.body.classList.remove('show-hint')

  }

  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGiphy(searchTerm)
  }

}


const clearSearch = event => {
  document.body.classList.remove('has-results')
  videosElement.innerHTML = ''
  hintElement.innerHTML = ''
  searchElement.value = ''
  document.getElementById("input-field").focus();
}


searchElement.addEventListener('keyup', doSearch)

clearElement.addEventListener('click', clearSearch)

document.addEventListener('keyup', event => {
  if(event.key === 'Escape') {
    clearSearch()
  }
})