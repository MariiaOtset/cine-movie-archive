import {Link,useLocation} from "react-router-dom";
import {useWatchlist} from "../../context/WatchlistContext.jsx";
import MovieList from "../../components/MovieList/MovieList.jsx";
import css from "./WatchlistPage.module.css";
export default function WatchlistPage(){
 const {movies}=useWatchlist(),location=useLocation();
 return <main className={css.page}><div className={css.heading}><p className="cine-eyebrow">YOUR PRIVATE COLLECTION</p><h1 className="cine-page-title">Keep the stories <em>close.</em></h1><p>A watchlist for the films that caught your eye. Saved locally in this browser, without creating an account.</p></div>
 {movies.length>0?<><div className={css.count}>{movies.length} {movies.length===1?"FILM":"FILMS"} IN YOUR WATCHLIST</div><MovieList movies={movies} state={{from:location}}/></>:<div className="cine-empty"><div className={css.symbol} aria-hidden="true">♡</div><h2>Your watchlist is a blank canvas.</h2><p>Find a film that intrigues you and tap the heart on its poster to save it here.</p><Link to="/movies" className="cine-button">Explore the collection ↗</Link></div>}</main>;
}
