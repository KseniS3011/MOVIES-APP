import { Component } from 'react'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { Spin, Alert, Pagination } from 'antd'

import Header from '../Header'
import SearchField from '../SearchField'
import MovieList from '../MovieList'
import movieApi from '../../services/TmdbMovieApi'
import defaultPoster from '../../assets/images/poster.jpg'

import './App.css'

class App extends Component {
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

  posterPath = 'https://image.tmdb.org/t/p/w500/'

  errorMessage = {
    loading: 'Oops! Something wrong. Try to reload page',
    noMovies: 'Oops! Movies were not found. Please change your request',
  }

  handleGetMovies = debounce((value, page = 1) => {
    movieApi.searchMovie(value, page).then((response) => {
      this.setState((prevState) => ({
        ...prevState,
        currentPage: page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
        isLoading: true,
        isError: false,
      }))
      const newMovieList = this.handleRenderMovieList(response.results)
      return this.handleUpdateMovieList(newMovieList)
    })
  }, 1000)

  constructor(props) {
    super(props)
    this.state = {
      genres: [],
      inputValue: '',
      isLoading: false,
      isError: false,
      isErrorMovies: false,
      currentPage: 1,
      totalPages: '',
      totalResults: '',
      movies: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleUpdateMovieList = this.handleUpdateMovieList.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleRenderMovieList = this.handleRenderMovieList.bind(this)
    this.handleTextClipping = this.handleTextClipping.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  componentDidMount() {
    movieApi.getGenres().then((response) => {
      this.setState({ genres: response.genres })
    })
    this.setState((prevState) => ({ ...prevState, isLoading: true }))
    movieApi
      .searchMovie('star', this.state.currentPage)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          movies: this.handleRenderMovieList(response.results),
          isLoading: false,
          totalPages: response.total_pages,
          totalResults: response.total_results,
        }))
      })
      .catch((error) => this.handleError(error))
  }

  componentDidUpdate(prevProps, prevState) {
    const value = this.state.inputValue.trim() || 'star'
    if (value && this.state.inputValue !== prevState.inputValue) {
      this.handleGetMovies(value, 1)
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.handleGetMovies(value, this.state.currentPage)
    }
  }

  handleInputChange(event) {
    this.setState((prevSatate) => {
      return { ...prevSatate, inputValue: event.target.value, isErrorMovies: false, isLoading: true }
    })
  }

  handleRenderMovieList(movieList) {
    const newMovieList = movieList.map((movie) => {
      const url = movie.poster_path === null ? defaultPoster : `${this.posterPath}${movie.poster_path}`
      const dateRelease = movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'No release date'
      return {
        imageUrl: url,
        id: movie.id,
        name: this.handleTextClipping(movie.title, 19),
        date: dateRelease,
        genre: movie.genre_ids,
        description: this.handleTextClipping(movie.overview, 180),
        raiting: (+movie.vote_average).toFixed(1),
      }
    })
    return newMovieList
  }

  handleUpdateMovieList(newMovieList) {
    if (!newMovieList.length) {
      this.setState((prevState) => {
        return { ...prevState, isErrorMovies: true, isLoading: false, movies: [] }
      })
    } else {
      this.setState((prevState) => {
        return { ...prevState, movies: newMovieList, isLoading: false }
      })
    }
  }

  handleTextClipping(text, symbolCount) {
    if (text.length < symbolCount) {
      return text
    } else {
      const newText = text.slice(0, symbolCount)
      return newText.replace(/\s[\w:;,!?.]+$/, '...')
    }
  }

  handleError(error) {
    this.setState({ isLoading: false, isError: true })
    return error
  }

  handleClick() {
    console.log(this.state.genres)
  }

  handlePaginationClick(page) {
    this.setState((prevState) => ({ ...prevState, currentPage: page, isLoading: true }))
  }

  render() {
    const { isLoading, isError, isErrorMovies, movies, genres, currentPage, totalPages } = this.state
    const BG_COLOR = '#1677ff'
    return (
      <div className="container-margin">
        <div className="container">
          <Header content={this.content} handleClick={this.handleClick} />
          <SearchField
            handleInputChange={this.handleInputChange}
            handleSubmit={() => {}}
            inputValue={this.state.inputValue}
          />
          {movies.length && !isLoading ? <MovieList movies={movies} genres={genres} /> : null}
          {isLoading ? <Spin size="large" /> : null}
          {isError ? <Alert description={this.errorMessage.loading} type="error" /> : null}
          {isErrorMovies ? <Alert description={this.errorMessage.noMovies} type="error" /> : null}
          {movies.length && !isLoading ? (
            <Pagination
              showSizeChanger={false}
              onChange={(page) => this.handlePaginationClick(page)}
              current={currentPage}
              total={totalPages}
              colorBgContainer={BG_COLOR}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default App
