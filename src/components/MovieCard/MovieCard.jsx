import { Rate } from 'antd'
import './MovieCard.css'

function MovieCard(props) {
  const { movie, genres } = props
  const imageWidth = 183
  const imageHeight = 281
  const movieGenres = genres.map((genre) => {
    return movie.genre.includes(genre.id) ? (
      <button key={genre.id} type="button">
        {genre.name}
      </button>
    ) : null
  })
  return (
    <div className="movie-card">
      <img className="movie-card__img" src={movie.imageUrl} alt="Poster" width={imageWidth} height={imageHeight} />
      <p className="movie-card__name">{movie.name}</p>
      <p className="movie-card__date">{movie.date}</p>
      <p className="movie-card__genre">{movieGenres}</p>
      <p className="movie-card__description">{movie.description}</p>
      <div className="movie-card__star-raiting">
        <Rate className="movie-card__stars" allowHalf={true} count={10} />
      </div>
      <p className="movie-card__raiting">{movie.raiting}</p>
    </div>
  )
}

export default MovieCard
