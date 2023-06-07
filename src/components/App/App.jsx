import { Component } from 'react'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { Spin, Alert, Pagination } from 'antd'

import Tabs from '../Tabs'
import SearchField from '../SearchField'
import MovieList from '../MovieList'
import movieApi from '../../services/TmdbMovieApi'
import { Provider } from '../../context/contextMovies'
import defaultPoster from '../../assets/images/poster.jpg'

import './App.css'

class App extends Component {
  tabs = [
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
    noRatedMovies: 'Oops! There are no rated movies',
  }

  debouncedGetMovies = debounce((value, page = 1) => {
    movieApi.searchMovie(value, page).then((response) => {
      this.setState((prevState) => ({
        ...prevState,
        currentPage: page,
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
      isErrorRated: false,
      isRated: false,
      isSearch: true,
      currentPage: 1,
      currentRatedPage: 1,
      totalResults: '',
      totalRatedResults: '',
      movies: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleUpdateMovieList = this.handleUpdateMovieList.bind(this)
    this.handleChangeTabs = this.handleChangeTabs.bind(this)
    this.handleRenderMovieList = this.handleRenderMovieList.bind(this)
    this.handleTextClipping = this.handleTextClipping.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
    this.handleAddRating = this.handleAddRating.bind(this)
    this.handleChangeMovieList = this.handleChangeMovieList.bind(this)
    this.handleGetRatedMovieList = this.handleGetRatedMovieList.bind(this)
    this.handleGetMovieList = this.handleGetMovieList.bind(this)
  }

  componentDidMount() {
    movieApi
      .getGenres()
      .then((response) => {
        this.setState({ genres: response.genres })
      })
      .catch((error) => this.handleError(error))
    this.setState((prevState) => ({ ...prevState, isLoading: true }))
    this.handleGetMovieList()
    if (!localStorage.getItem('guestSessionId')) {
      movieApi
        .createGuestSession()
        .then((response) => {
          localStorage.setItem('guestSessionId', response.guest_session_id)
          localStorage.setItem('ratedMovies', '[]')
        })
        .catch((error) => this.handleError(error))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const value = this.state.inputValue.trim() || 'star'
    if (value && this.state.inputValue !== prevState.inputValue) {
      this.debouncedGetMovies(value, 1)
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.debouncedGetMovies(value, this.state.currentPage)
    }
    if (this.state.currentRatedPage !== prevState.currentRatedPage) {
      this.handleGetRatedMovieList()
    }
  }

  componentDidCatch(error) {
    this.handleError(error)
  }

  handleInputChange(event) {
    this.setState((prevSatate) => {
      return { ...prevSatate, inputValue: event.target.value, isErrorMovies: false, isLoading: true }
    })
  }

  handleRenderMovieList(movieList) {
    const ratedList =
      JSON.parse(localStorage.getItem('ratedMovies')) !== null ? JSON.parse(localStorage.getItem('ratedMovies')) : []
    const newMovieList = movieList.map((movie) => {
      const url = movie.poster_path === null ? defaultPoster : `${this.posterPath}${movie.poster_path}`
      const dateRelease = movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'No release date'
      const [starRating] = ratedList.length ? ratedList.filter((ratedItem) => ratedItem.id === movie.id) : ''
      return {
        imageUrl: url,
        id: movie.id,
        name: this.handleTextClipping(movie.title, 19),
        date: dateRelease,
        genre: movie.genre_ids,
        description: this.handleTextClipping(movie.overview, 180),
        raiting: (+movie.vote_average).toFixed(1),
        userRating: movie.rating || starRating?.gradeValue || '',
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

  handleChangeTabs() {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
      isSearch: !prevState.isSearch,
      isRated: !prevState.isRated,
      isErrorRated: false,
    }))
  }

  handleChangeMovieList() {
    this.handleChangeTabs()
    if (!this.state.isRated) {
      this.handleGetRatedMovieList()
    } else {
      this.handleGetMovieList()
    }
  }

  handlePaginationClick(page) {
    if (!this.state.isRated) {
      this.setState((prevState) => ({ ...prevState, currentPage: page, isLoading: true }))
    } else {
      this.setState((prevState) => ({ ...prevState, currentRatedPage: page, isLoading: true }))
    }
  }

  handleAddRating(gradeValue, id) {
    const guestSessionId = localStorage.getItem('guestSessionId')
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies'))
    const newRatedList = []
    const newRatedItem = { id, gradeValue }
    const index = ratedMovies.findIndex((ratedItem) => ratedItem.id === id)
    if (index && index !== -1) {
      newRatedList.push(...ratedMovies.slice(0, index), newRatedItem, ...ratedMovies.slice(index + 1))
    } else if (!index || index === -1) {
      ratedMovies.push(newRatedItem)
      newRatedList.push(...ratedMovies)
    }
    localStorage.setItem('ratedMovies', JSON.stringify(newRatedList))
    movieApi.sendRatedMovie(gradeValue, id, guestSessionId)
  }

  handleGetRatedMovieList() {
    const guestSessionId = localStorage.getItem('guestSessionId')
    movieApi
      .getRatedMovies(guestSessionId, this.state.currentRatedPage)
      .then((response) => {
        if (!response.results.length) {
          this.setState((prevState) => ({
            ...prevState,
            isErrorRated: true,
          }))
        }
        this.setState((prevState) => ({
          ...prevState,
          movies: this.handleRenderMovieList(response.results),
          isLoading: false,
          totalRatedResults: response.total_results,
        }))
      })
      .catch((error) => {
        this.handleError(error)
      })
  }

  handleGetMovieList() {
    movieApi
      .searchMovie(this.state.inputValue || 'star', this.state.currentPage)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          movies: this.handleRenderMovieList(response.results),
          isLoading: false,
          totalResults: response.total_results,
        }))
      })
      .catch((error) => this.handleError(error))
  }

  render() {
    const {
      isLoading,
      isError,
      isErrorMovies,
      isErrorRated,
      movies,
      currentPage,
      currentRatedPage,
      totalResults,
      totalRatedResults,
      isRated,
      isSearch,
    } = this.state
    return (
      <div className="container-margin">
        <div className="container">
          <Tabs tabs={this.tabs} changeMovieList={this.handleChangeMovieList} isRated={isRated} isSearch={isSearch} />
          {!isRated ? (
            <SearchField
              handleInputChange={this.handleInputChange}
              handleSubmit={() => {}}
              inputValue={this.state.inputValue}
            />
          ) : null}
          <Provider value={{ genres: this.state.genres }}>
            {movies.length && !isLoading ? (
              <MovieList movies={movies} isRated={isRated} addRating={this.handleAddRating} />
            ) : null}
          </Provider>
          {isLoading ? <Spin size="large" /> : null}
          {isError ? <Alert description={this.errorMessage.loading} type="error" /> : null}
          {isErrorMovies ? <Alert description={this.errorMessage.noMovies} type="error" /> : null}
          {isErrorRated && !isLoading && !movies.length ? (
            <Alert description={this.errorMessage.noRatedMovies} type="error" />
          ) : null}
          {isErrorRated ? null : movies.length && !isLoading ? (
            <Pagination
              pageSize={20}
              showSizeChanger={false}
              onChange={(page) => this.handlePaginationClick(page)}
              current={isRated ? currentRatedPage : currentPage}
              total={isRated ? totalRatedResults : totalResults}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default App
