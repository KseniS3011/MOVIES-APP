const API_KEY = '4e95af3546ab2dd82062832aec22cc0b'
const BASE_URL = 'https://api.themoviedb.org/3'
const SESSION_RESOURSE = '/authentication/guest_session/new'

const movieApi = {
  getResource(url, options = null) {
    return fetch(url, options)
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => {
        throw new Error(error.message)
      })
  },

  searchMovie(queryValue, currentPage = 1) {
    const url = `${BASE_URL}/search/movie?query=${queryValue}&api_key=${API_KEY}&page=${currentPage}`
    return this.getResource(url)
  },

  getGenres() {
    const url = `${BASE_URL}/genre/movie/list?language=en-EN&api_key=${API_KEY}`
    return this.getResource(url)
  },

  createGuestSession() {
    const url = `${BASE_URL}${SESSION_RESOURSE}?api_key=${API_KEY}`
    return this.getResource(url)
  },

  sendRatedMovie(rating, movieId, guestSessionId) {
    const url = `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    }
    return this.getResource(url, options)
  },

  getRatedMovies(guestSessionId, currentPage = 1) {
    const url = `${BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&page=${currentPage}`
    return this.getResource(url)
  },
}

export default movieApi