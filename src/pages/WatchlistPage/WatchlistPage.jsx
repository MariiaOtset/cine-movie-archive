import {useMemo,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import {useWatchlist} from "../../context/useWatchlist.js";
import MovieList from "../../components/MovieList/MovieList.jsx";
import css from "./WatchlistPage.module.css";
import {formatMovieRating} from "../../utils/movieRating.js";
export default function WatchlistPage(){
 const {movies,isWatched}=useWatchlist(),location=useLocation();
 const [filter,setFilter]=useState("all"),[sort,setSort]=useState("recent"),[suggestion,setSuggestion]=useState(null);
 const watched=movies.filter(m=>isWatched(m.id)).length;
 const list=useMemo(()=>{
  const result=movies.filter(m=>filter==="all"||(filter==="watched"?isWatched(m.id):!isWatched(m.id)));
  if(sort==="title")return [...result].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==="rating")return [...result].sort((a,b)=>(b.vote_average||0)-(a.vote_average||0));
  return [...result].reverse();
 },[movies,isWatched,filter,sort]);
 const pick=()=>{const pool=movies.filter(m=>!isWatched(m.id));if(!pool.length){setSuggestion(null);return;}const fresh=pool.length>1?pool.filter(m=>m.id!==suggestion?.id):pool;setSuggestion(fresh[Math.floor(Math.random()*fresh.length)]);};
 const pickVisible=suggestion&&movies.some(m=>m.id===suggestion.id)&&!isWatched(suggestion.id);
 return <main className={css.page}>
  <div className={css.heading}><p className="cine-eyebrow">YOUR PRIVATE FILM COLLECTION</p><h1 className="cine-page-title">Keep the stories <em>close.</em></h1><p>A personal archive for films you love and films still waiting to be discovered. All saved in this browser.</p></div>
  {movies.length>0?<><div className={css.dashboard}><div><span>YOUR COLLECTION</span><strong>{movies.length.toString().padStart(2,"0")}</strong><small>Films saved</small></div><div><span>SEEN &amp; LOVED</span><strong>{watched.toString().padStart(2,"0")}</strong><small>Marked as watched</small></div><div><span>UP NEXT</span><strong>{(movies.length-watched).toString().padStart(2,"0")}</strong><small>Still on the watchlist</small></div></div>
   <section className={css.suggestion} aria-label="Find a film for tonight"><div><p className="cine-eyebrow">THE MOVIE-NIGHT DECISION</p><h2 className="cine-serif">Not sure what to <em>watch tonight?</em></h2><p>Let the archive choose a film from your unwatched collection.</p><button type="button" onClick={pick} className="cine-button" disabled={movies.length===watched}>{movies.length===watched?"Everything watched":"Surprise me ↗"}</button></div>{pickVisible?<Link to={"/movies/"+suggestion.id} state={{from:location}} className={css.suggestCard}>{suggestion.poster_path?<img src={"https://image.tmdb.org/t/p/w342"+suggestion.poster_path} alt={suggestion.title+" poster"}/>:<div className={css.posterFallback}>CINÉ</div>}<div><span>TONIGHT&apos;S PICK</span><strong>{suggestion.title}</strong><small>{formatMovieRating(suggestion)} &nbsp; VIEW FILM ↗</small></div></Link>:<div className={css.placeholder} aria-hidden="true"><span>✳</span><strong>YOUR NEXT STORY<br/>IS JUST A CLICK AWAY.</strong></div>}</section>
   <div className={css.controls}><div className={css.tabs} role="group" aria-label="Filter watchlist">{[{value:"all",label:"All films"},{value:"queue",label:"To watch"},{value:"watched",label:"Watched"}].map(opt=><button key={opt.value} type="button" aria-pressed={filter===opt.value} onClick={()=>setFilter(opt.value)}>{opt.label}</button>)}</div><label>Sort by <select aria-label="Sort your watchlist" value={sort} onChange={e=>setSort(e.target.value)}><option value="recent">Recently saved</option><option value="title">Title A–Z</option><option value="rating">Highest rated</option></select></label></div>
   {list.length>0?<MovieList movies={list} state={{from:location}} showWatched/>:<div className="cine-empty"><h2>Nothing in this view yet.</h2><p>Try another tab, or mark films as watched to organise your archive.</p><button className="cine-button" onClick={()=>setFilter("all")}>Show all films ↗</button></div>}
  </>:<div className="cine-empty"><div className={css.symbol} aria-hidden="true">♡</div><h2>Your watchlist is a blank canvas.</h2><p>Find a film that intrigues you and tap the heart on its poster to save it here.</p><Link to="/movies" className="cine-button">Explore the collection ↗</Link></div>}
 </main>;
}
