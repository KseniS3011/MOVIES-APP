import MovieCard from '../MovieCard'
import './MovieList.css'

function MovieList(props) {
  const { movies } = props
  return (
    <ul className="movie-list">
      {movies.map((movie) => {
        return (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        )
      })}
    </ul>
  )
}

export default MovieList
