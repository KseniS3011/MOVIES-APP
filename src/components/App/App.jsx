import { Component } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns'

import Header from '../Header'
import SearchField from '../SearchField'
import MovieList from '../MovieList'
import defaultPoster from '../../assets/images/poster.jpg'

import './App.css'

class App extends Component {
  idCounter = 0

  content = [
    {
      value: 'Search',
      id: 1,
    },
    {
      value: 'Rated',
      id: 2,
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      movies: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleRenderMovieList = this.handleRenderMovieList.bind(this)
    this.handleTextClipping = this.handleTextClipping.bind(this)
  }

  handleInputChange(event) {
    this.setState((prevSatate) => {
      return { ...prevSatate, inputValue: event.target.value }
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const value = this.state.inputValue.trim()
    const moviesList = await this.getApiItem(
      `https://api.themoviedb.org/3/search/movie?query=${this.state.inputValue}&api_key=4e95af3546ab2dd82062832aec22cc0b`
    )
      .then((body) => {
        return body
      })
      .then((movies) => {
        return this.handleRenderMovieList(movies.results)
      })
      .catch((error) => {
        return error
      })
    if (value) {
      this.setState((prevSatate) => {
        return { ...prevSatate, inputValue: '' }
      })
    }
    return moviesList
  }

  handleRenderMovieList(movieList) {
    console.log(movieList)
    const newMovieList = movieList.map((movie) => {
      const url = movie.poster_path === null ? defaultPoster : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      const dateRelease = movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'No release date'
      this.idCounter++
      return {
        imageUrl: url,
        id: this.idCounter,
        name: this.handleTextClipping(movie.title, 15),
        date: dateRelease,
        genre: movie.genre_ids,
        description: this.handleTextClipping(movie.overview, 180),
        raiting: (+movie.vote_average).toFixed(1),
      }
    })
    this.setState((prevState) => {
      return { ...prevState, movies: newMovieList }
    })
  }

  handleTextClipping(text, symbolCount) {
    if (text.length < symbolCount) {
      return text
    } else {
      const textArray = text.split(' ')
      let symbolCounter = 0
      const newDescription = textArray.reduce((acc, word) => {
        symbolCounter += word.length + 1
        if (symbolCounter < symbolCount) {
          acc.push(word)
        } else {
          return acc
        }
        return acc
      }, [])
      return newDescription.join(' ').concat('...')
    }
  }

  handleClick() {
    // this.setState((prevSatate) => {
    //   return { ...prevSatate, inputValue: event.target.value }
    // })
    console.log(this.state.movies)
  }

  // eslint-disable-next-line class-methods-use-this
  async getApiItem(url) {
    const result = await fetch(url)
    if (!result.ok) {
      throw new Error(`Error ${result.status}`)
    }
    const body = await result.json()
    return body
  }

  render() {
    return (
      <div className="container-margin">
        <div className="container">
          <Header content={this.content} handleClick={this.handleClick} />
          <SearchField
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            inputValue={this.state.inputValue}
          />
          <MovieList movies={this.state.movies} />
        </div>
      </div>
    )
  }
}

export default App
