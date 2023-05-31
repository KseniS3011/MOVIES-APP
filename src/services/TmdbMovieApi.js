const API_KEY = '4e95af3546ab2dd82062832aec22cc0b'
const BASE_URL = 'https://api.themoviedb.org/3'

const movieApi = {
  searchMovie(queryValue, currentPage = 1) {
    return fetch(`${BASE_URL}/search/movie?query=${queryValue}&api_key=${API_KEY}&page=${currentPage}`)
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => {
        throw new Error(error.message)
      })
  },

  getGenres() {
    return fetch(`${BASE_URL}/genre/movie/list?language=en-EN&api_key=${API_KEY}`)
      .then((result) => result.json())
      .then((response) => response)
      .catch((error) => error.message)
  },
}

export default movieApi
