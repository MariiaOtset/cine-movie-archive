import {useEffect,useState} from "react";
import {Link,NavLink,useLocation,useParams} from "react-router-dom";
import {fetchMovieDetails,movieImage} from "../../api/movies-api.js";
import {useWatchlist} from "../../context/WatchlistContext.jsx";
import MovieList from "../../components/MovieList/MovieList.jsx";
import MovieCast from "../../components/MovieCast/MovieCast.jsx";
import MovieReviews from "../../components/MovieReviews/MovieReviews.jsx";
import MovieSkeleton from "../../components/MovieSkeleton/MovieSkeleton.jsx";
import css from "./MovieDetailsPage.module.css";
const minutes=total=>total?Math.floor(total/60)+"h "+(total%60)+"m":"Not specified";
export default function MovieDetailsPage(){
 const {movieId}=useParams(),location=useLocation();
 const {toggle,contains}=useWatchlist();
 const [movie,setMovie]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(false),[retry,setRetry]=useState(0),[trailerOpen,setTrailerOpen]=useState(false);
 const section=location.pathname.endsWith("/cast")?"cast":location.pathname.endsWith("/reviews")?"reviews":null;
 const back=location.state?.from||"/movies";
 useEffect(()=>{let active=true;setLoading(true);setError(false);setMovie(null);setTrailerOpen(false);
  fetchMovieDetails(movieId).then(({data})=>{if(active)setMovie(data);}).catch(()=>{if(active)setError(true);}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[movieId,retry]);
 useEffect(()=>{if(!trailerOpen)return;const esc=e=>{if(e.key==="Escape")setTrailerOpen(false);};window.addEventListener("keydown",esc);return()=>window.removeEventListener("keydown",esc);},[trailerOpen]);
 if(loading)return <main className={css.loading}><div className="cine-container"><div className={css.loaderTitle}/><MovieSkeleton count={5}/></div></main>;
 if(error||!movie)return <main className={css.error}><div className="cine-container"><p className="cine-eyebrow">THAT SCENE IS MISSING</p><h1 className="cine-page-title">Unable to load <em>this film.</em></h1><p>Please check your connection or try again.</p><button className="cine-button" onClick={()=>setRetry(r=>r+1)}>Retry loading ↗</button><Link to="/movies">Browse other films →</Link></div></main>;
 const trailer=movie.videos?.results?.find(v=>v.site==="YouTube"&&v.type==="Trailer"&&v.official)||movie.videos?.results?.find(v=>v.site==="YouTube"&&["Trailer","Teaser"].includes(v.type));
 const cast=movie.credits?.cast||[],recommendations=(movie.recommendations?.results||[]).filter(m=>m.poster_path);
 return <main>
  <section className={css.hero} style={movie.backdrop_path?{backgroundImage:'linear-gradient(90deg,#0d1119 6%,#0d1119bb 53%,#0d111966),linear-gradient(0deg,#0d1119,#0d111900 62%),url("'+movieImage(movie.backdrop_path,"original")+'")'}:{}}>
   <div className="cine-container"><div className={css.breadcrumb}><Link to="/">Discover</Link><span>/</span><Link to="/movies">Explore films</Link><span>/</span><span>{movie.title}</span></div><div className={css.heroContent}><div className={css.poster}>{movie.poster_path?<img src={movieImage(movie.poster_path,"w780")} alt={movie.title+" official poster"}/>:<div className={css.posterMissing}>CINÉ / ARCHIVE</div>}</div><div className={css.copy}><p className="cine-eyebrow">THE ARCHIVE / FEATURED FILM</p><h1 className="cine-serif">{movie.title}</h1>{movie.tagline&&<p className={css.tagline}>{movie.tagline}</p>}<div className={css.metadata}><span>★ {Number(movie.vote_average||0).toFixed(1)} / 10</span><span>{movie.release_date?.slice(0,4)||"—"}</span><span>{minutes(movie.runtime)}</span><span>{movie.original_language?.toUpperCase()}</span></div><div className={css.genres}>{(movie.genres||[]).map(g=><span key={g.id}>{g.name}</span>)}</div><p className={css.overview}>{movie.overview||"A full synopsis is not yet available for this film."}</p><div className={css.actions}>{trailer&&<button className="cine-button" onClick={()=>setTrailerOpen(true)}><span aria-hidden="true">▶</span> Watch trailer</button>}<button type="button" className="cine-button cine-outline" aria-pressed={contains(movie.id)} onClick={()=>toggle(movie)}>{contains(movie.id)?"♥ In your watchlist":"♡ Save to watchlist"}</button></div></div></div></div>
  </section>
  <div className={css.body+" cine-container"}>
   <div className={css.contentTop}><p className="cine-eyebrow">THE STORY BEHIND THE SCREEN</p><h2 className="cine-serif">More than <em>meets the eye.</em></h2><p>Explore the cast, hear what viewers think, and discover what to watch next.</p></div>
   <section className={css.castPreview}><div className={css.sectionHead}><div><p className="cine-eyebrow">THE PEOPLE BEHIND THE STORY</p><h3 className="cine-serif">Meet the <em>cast.</em></h3></div><NavLink to="cast" state={location.state}>FULL CAST <span aria-hidden="true">↗</span></NavLink></div><div className={css.actors}>{cast.slice(0,6).map(actor=><div className={css.actor} key={actor.cast_id??actor.credit_id??actor.id}>{actor.profile_path?<img src={movieImage(actor.profile_path,"w185")} alt={actor.name} loading="lazy"/>:<div className={css.actorFallback} aria-hidden="true">✳</div>}<strong>{actor.name}</strong><span>{actor.character}</span></div>)}</div>{!cast.length&&<p className={css.noData}>Cast information is not available at the moment.</p>}</section>
   <nav className={css.tabs} aria-label="More film information"><NavLink end to={"/movies/"+movieId} state={location.state} className={({isActive})=>isActive?css.active:""}>Overview</NavLink><NavLink to="cast" state={location.state} className={({isActive})=>isActive?css.active:""}>Full cast</NavLink><NavLink to="reviews" state={location.state} className={({isActive})=>isActive?css.active:""}>Reviews</NavLink></nav>
   {section==="cast"?<MovieCast/>:section==="reviews"?<MovieReviews/>:<div className={css.editorial}><div><p className="cine-eyebrow">FILM NOTES</p><h3 className="cine-serif">The art of <em>storytelling.</em></h3></div><p>{movie.overview||"Find out more about this film through its cast and viewer reviews."}</p></div>}
   {recommendations.length>0&&<section className={css.recs}><div className={css.sectionHead}><div><p className="cine-eyebrow">STAY FOR THE NEXT SCENE</p><h3 className="cine-serif">You may <em>also love.</em></h3></div><Link to="/movies">EXPLORE MORE ↗</Link></div><MovieList movies={recommendations.slice(0,12)} variant="rail" state={{from:location}}/></section>}
   <Link className={css.back} to={back}>← Back to films</Link>
  </div>
  {trailerOpen&&trailer&&<div className={css.videoOverlay} role="dialog" aria-modal="true" aria-label={movie.title+" trailer"} onMouseDown={e=>{if(e.target===e.currentTarget)setTrailerOpen(false);}}><div className={css.videoModal}><button type="button" aria-label="Close trailer" onClick={()=>setTrailerOpen(false)}>✕ Close trailer</button><div className={css.video}><iframe title={movie.title+" trailer"} src={"https://www.youtube-nocookie.com/embed/"+encodeURIComponent(trailer.key)+"?autoplay=1"} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div></div></div>}
 </main>;
}
