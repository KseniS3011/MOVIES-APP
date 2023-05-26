import './MovieCard.css'

function MovieCard(props) {
  const { movie } = props
  const imageWidth = 183
  const imageHeight = 281
  return (
    <div className="movie-card">
      <img className="movie-card__img" src={movie.imageUrl} alt="Poster" width={imageWidth} height={imageHeight} />
      <p className="movie-card__name">{movie.name}</p>
      <p className="movie-card__date">{movie.date}</p>
      <p className="movie-card__genre">
        {movie.genre.map((genre) => {
          return (
            <button key={genre} className="movie-card__genre-button" type="button">
              {genre}
            </button>
          )
        })}
      </p>
      <p className="movie-card__description">{movie.description}</p>
      <p className="movie-card__star-raiting">{movie.raiting}</p>
      <p className="movie-card__raiting">{movie.raiting}</p>
    </div>
  )
}

export default MovieCard
