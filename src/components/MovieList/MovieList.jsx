import MovieCard from '../MovieCard'
import './MovieList.css'

function MovieList(props) {
  const { movies, genres } = props
  return (
    <ul className="movie-list">
      {movies.map((movie) => {
        return (
          <li key={movie.id}>
            <MovieCard movie={movie} genres={genres} />
          </li>
        )
      })}
    </ul>
  )
}

export default MovieList
