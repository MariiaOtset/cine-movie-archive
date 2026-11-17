import {Link} from "react-router-dom";
import {useWatchlist} from "../../context/useWatchlist.js";
import {movieImage} from "../../api/movies-api.js";
import css from "./MovieList.module.css";
import {formatMovieRating,hasMovieRating} from "../../utils/movieRating.js";
function MovieCard({movie,state,showWatched}){
 const {toggle,contains,isWatched,markWatched}=useWatchlist();
 const year=movie.release_date?.slice(0,4)||"—";
 const rating=formatMovieRating(movie,{compact:true});
 return <li className={css.movieItem}>
  <Link to={"/movies/"+movie.id} state={{...state,movie}} className={css.movieLink} aria-label={"View "+movie.title}>
   <div className={css.poster}>{movie.poster_path?<img src={movieImage(movie.poster_path)} alt={movie.title+" poster"} loading="lazy"/>:<div className={css.noPoster}>CINÉ / ARCHIVE <span>No poster available</span></div>}
    <span className={css.rating+(hasMovieRating(movie)?"": " "+css.unrated)}>{rating}</span><span className={css.view}>VIEW FILM <span aria-hidden="true">↗</span></span>
   </div>
   <div className={css.info}><h3>{movie.title}</h3><p>{year} <span>·</span> Film</p></div>
  </Link>
  <button type="button" className={css.save} aria-label={contains(movie.id)?"Remove "+movie.title+" from watchlist":"Save "+movie.title+" to watchlist"} aria-pressed={contains(movie.id)} title={contains(movie.id)?"Remove from watchlist":"Save to watchlist"} onClick={()=>toggle(movie)}>{contains(movie.id)?"♥":"♡"}</button>
  {showWatched&&<button type="button" className={css.watched+(isWatched(movie.id)?" "+css.isWatched:"")} onClick={()=>markWatched(movie.id)} aria-pressed={isWatched(movie.id)} title={isWatched(movie.id)?"Mark as to watch":"Mark as watched"}>{isWatched(movie.id)?"✓ Watched":"○ Mark watched"}</button>}
 </li>;
}
export default function MovieList({movies=[],state,variant="grid",showWatched=false}){return <ul className={css.movieList+" "+(variant==="rail"?css.rail:"")}>{movies.filter(Boolean).map(movie=><MovieCard key={movie.id} movie={movie} state={state} showWatched={showWatched}/>)}</ul>;}
