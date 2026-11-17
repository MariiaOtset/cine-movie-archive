import {useState} from "react";
import {Link} from "react-router-dom";
import {useWatchlist} from "../../context/useWatchlist.js";
import {movieImage} from "../../api/movies-api.js";
import css from "./MovieNightPicker.module.css";
const options=[{id:"all",name:"Anything goes"},{id:"28",name:"An adventure"},{id:"18",name:"Feel something"},{id:"35",name:"A good laugh"},{id:"14",name:"Another world"}];
export default function MovieNightPicker({movies=[]}){
 const [genre,setGenre]=useState("all"),[pick,setPick]=useState(null);
 const {toggle,contains}=useWatchlist();
 const unique=Array.from(new Map(movies.filter(m=>m.poster_path&&m.id).map(m=>[m.id,m])).values());
 const choose=()=>{
  const matching=genre==="all"?unique:unique.filter(m=>m.genre_ids?.includes(Number(genre)));
  const pool=matching.length?matching:unique;
  if(!pool.length){setPick(null);return;}
  const fresh=pool.length>1?pool.filter(m=>m.id!==pick?.id):pool;
  setPick(fresh[Math.floor(Math.random()*fresh.length)]);
 };
 return <section className={css.section} aria-labelledby="movie-night-title"><div className={css.content}><div><p className="cine-eyebrow">A LITTLE CINEMATIC SERENDIPITY</p><h2 className="cine-serif" id="movie-night-title">Let fate pick <em>the feature.</em></h2><p>Can&apos;t decide what to watch? Choose a feeling, and let the archive suggest a film from today&apos;s curated collection.</p><div className={css.options} role="group" aria-label="Choose movie-night mood">{options.map(o=><button type="button" key={o.id} aria-pressed={genre===o.id} onClick={()=>{setGenre(o.id);setPick(null);}}>{o.name}</button>)}</div><button className={css.roll} type="button" disabled={!unique.length} onClick={choose}>{unique.length?"Surprise me":"Loading films..."} <span aria-hidden="true">↗</span></button></div>
 {pick?<div className={css.reveal}><div className={css.image}><img src={movieImage(pick.poster_path,"w500")} alt={pick.title+" poster"}/></div><div className={css.revealText}><span>✦ THE ARCHIVE HAS SPOKEN</span><strong>{pick.title}</strong><p>★ {Number(pick.vote_average||0).toFixed(1)} &nbsp;·&nbsp; {pick.release_date?.slice(0,4)||"FILM"}</p><Link to={"/movies/"+pick.id}>Explore this film ↗</Link><button type="button" onClick={()=>toggle(pick)} aria-pressed={contains(pick.id)}>{contains(pick.id)?"♥ Saved":"♡ Save for later"}</button></div></div>:<div className={css.blank}><span aria-hidden="true">✳</span><p>TONIGHT&apos;S SCREENING</p><strong className="cine-serif">A story awaits.</strong><small>Choose a mood and reveal a film.</small></div>}
 </div></section>;
}
