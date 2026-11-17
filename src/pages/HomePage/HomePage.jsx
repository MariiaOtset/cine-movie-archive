import {useEffect,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList.jsx";
import MovieSkeleton from "../../components/MovieSkeleton/MovieSkeleton.jsx";
import {fetchTrendingMovies,fetchMovieSection,movieImage} from "../../api/movies-api.js";
import css from "./HomePage.module.css";
const moods=[
 {label:"Feel everything",subtitle:"DRAMA / 01",genre:"18",color:"brown"},
 {label:"The unexpected",subtitle:"THRILLER / 02",genre:"53",color:"blue"},
 {label:"A little magic",subtitle:"FANTASY / 03",genre:"14",color:"green"},
 {label:"Fall in love",subtitle:"ROMANCE / 04",genre:"10749",color:"rose"}
];
const headings=[{key:"trending",eyebrow:"01 / RIGHT NOW",title:"In the",em:"spotlight.",desc:"What everyone is watching today."},{key:"popular",eyebrow:"02 / THE CROWD FAVOURITES",title:"The films worth",em:"talking about.",desc:"Beloved stories and current favourites."},{key:"top_rated",eyebrow:"03 / CRITICALLY ACCLAIMED",title:"Simply",em:"unforgettable.",desc:"The best of the best, all in one place."},{key:"upcoming",eyebrow:"04 / COMING SOON",title:"The next big",em:"thing.",desc:"A first look at the films on the horizon."}];
export default function HomePage(){
 const [data,setData]=useState({trending:[],popular:[],top_rated:[],upcoming:[]}),[loading,setLoading]=useState(true),[error,setError]=useState(false);
 const location=useLocation();
 useEffect(()=>{let active=true;async function load(){
  const results=await Promise.allSettled([fetchTrendingMovies(),fetchMovieSection("popular"),fetchMovieSection("top_rated"),fetchMovieSection("upcoming")]);
  if(!active)return;
  const next={};["trending","popular","top_rated","upcoming"].forEach((key,i)=>{next[key]=results[i].status==="fulfilled"?results[i].value.filter(m=>m.poster_path):[];});
  setData(next);setError(Object.values(next).every(arr=>arr.length===0));setLoading(false);
 }load();return()=>{active=false;};},[]);
 const hero=data.trending.find(movie=>movie.backdrop_path)||data.popular.find(movie=>movie.backdrop_path);
 return <main>
  <section className={css.hero} style={hero?.backdrop_path?{backgroundImage:'linear-gradient(90deg,rgba(8,11,18,.92),rgba(8,11,18,.58) 52%,rgba(8,11,18,.08)),linear-gradient(0deg,#0d1119,transparent 37%),url("'+movieImage(hero.backdrop_path,"original")+'")'}:{}}>
   <div className={css.heroContent}><p className="cine-eyebrow">AN EDITORIAL GUIDE TO THE MOVING IMAGE <span>✳</span> VOL. 01</p>
    <h1 className="cine-serif">Where great<br/>stories <em>stay with you.</em></h1>
    <p className={css.intro}>Discover the films that move you. From modern classics to tomorrow&apos;s favourites — your next cinematic obsession begins here.</p>
    {hero&&<div className={css.heroFilm}><span>NOW IN THE SPOTLIGHT</span><strong>{hero.title}</strong><span>★ {Number(hero.vote_average||0).toFixed(1)} &nbsp;·&nbsp; {hero.release_date?.slice(0,4)}</span></div>}
    <div className={css.heroActions}><Link className="cine-button" to={hero?"/movies/"+hero.id:"/movies"} state={{from:location}}> {hero?"Explore featured film":"Explore all films"} <span aria-hidden="true">↗</span></Link><Link className={css.secondary} to="/movies">Browse the collection <span aria-hidden="true">→</span></Link></div>
   </div><div className={css.heroBottom}><span>CURATED FOR CURIOUS MINDS</span><span>SCROLL TO DISCOVER &nbsp; ↓</span></div>
  </section>
  <div className={css.content}>
   {error&&<div className="cine-container cine-error">Unable to load the film collection right now. Please try again later.</div>}
   <section className={css.firstSection} aria-labelledby="discover-films"><div className={css.sectionLead}><p className="cine-eyebrow">THE CINÉ ARCHIVE</p><h2 id="discover-films" className="cine-serif">Something extraordinary<br/>is <em>always playing.</em></h2><p>Find the stories worth your time, one frame at a time.</p></div></section>
   {headings.slice(0,2).map(({key,eyebrow,title,em,desc})=><section className={css.filmSection} key={key} aria-label={key.replace("_"," ")}><div className={css.sectionHeader}><div><span className="cine-eyebrow">{eyebrow}</span><h2 className="cine-serif">{title} <em>{em}</em></h2><p>{desc}</p></div><Link to="/movies" className={css.more}>EXPLORE MORE <span aria-hidden="true">↗</span></Link></div>{loading?<MovieSkeleton/>:<MovieList movies={data[key]} variant="rail" state={{from:location}}/>}</section>)}
   <section className={css.moods} aria-labelledby="mood-heading"><div className={css.sectionHeader}><div><p className="cine-eyebrow">FOLLOW YOUR FEELING</p><h2 id="mood-heading" className="cine-serif">What are you <em>in the mood for?</em></h2><p>Every mood deserves its own movie night.</p></div></div><div className={css.moodGrid}>{moods.map((mood)=>{const poster=[...data.popular,...data.trending].find(m=>m.genre_ids?.includes(Number(mood.genre))&&m.backdrop_path);return <Link key={mood.genre} to={"/movies?genre="+mood.genre+"&mood="+encodeURIComponent(mood.label)} className={css.mood+" "+css[mood.color]} style={poster?{backgroundImage:'linear-gradient(180deg,#060d1980,#060d19c7),url("'+movieImage(poster.backdrop_path,"w780")+'")'}:{}}><span>{mood.subtitle}</span><h3 className="cine-serif">{mood.label}</h3><span className={css.moodArrow} aria-hidden="true">↗</span></Link>})}</div></section>
   {headings.slice(2).map(({key,eyebrow,title,em,desc})=><section className={css.filmSection} key={key}><div className={css.sectionHeader}><div><span className="cine-eyebrow">{eyebrow}</span><h2 className="cine-serif">{title} <em>{em}</em></h2><p>{desc}</p></div><Link to="/movies" className={css.more}>EXPLORE MORE <span aria-hidden="true">↗</span></Link></div>{loading?<MovieSkeleton/>:<MovieList movies={data[key]} variant="rail" state={{from:location}}/>}</section>)}
  </div>
  <section className={css.endcap}><div className="cine-container"><p className="cine-eyebrow">KEEP THE STORIES CLOSE</p><h2 className="cine-serif">A film for every feeling.<br/><em>Save the ones that stay.</em></h2><p>Your personal watchlist of stories worth returning to — no account required.</p><Link className="cine-button" to="/watchlist">Open my watchlist <span aria-hidden="true">↗</span></Link></div></section>
 </main>;
}
