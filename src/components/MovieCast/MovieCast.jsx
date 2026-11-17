import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {fetchMovieCast,movieImage} from "../../api/movies-api.js";
import css from "./MovieCast.module.css";
export default function MovieCast(){
 const {movieId}=useParams();const [cast,setCast]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(false);
 useEffect(()=>{let active=true;setLoading(true);setError(false);fetchMovieCast(movieId).then(data=>{if(active)setCast(data||[]);}).catch(()=>{if(active)setError(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[movieId]);
 if(loading)return <p className={css.status}>Loading cast...</p>;
 if(error)return <p className={css.status}>Cast details are temporarily unavailable.</p>;
 if(!cast.length)return <p className={css.status}>No cast information available for this film.</p>;
 return <section><h3 className={css.heading}>Full cast & characters</h3><ul className={css.grid}>{cast.slice(0,30).map(actor=><li key={actor.credit_id||actor.id}><div className={css.image}>{actor.profile_path?<img src={movieImage(actor.profile_path,"w185")} loading="lazy" alt={actor.name}/>:<span aria-hidden="true">✳</span>}</div><div><strong>{actor.name}</strong><span>{actor.character||"Cast member"}</span></div></li>)}</ul></section>;
}
