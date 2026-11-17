import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {fetchMovieReviews} from "../../api/movies-api.js";
import css from "./MovieReviews.module.css";
export default function MovieReviews(){
 const {movieId}=useParams();const [reviews,setReviews]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(false);
 useEffect(()=>{let active=true;setLoading(true);setError(false);fetchMovieReviews(movieId).then(data=>{if(active)setReviews(data||[]);}).catch(()=>{if(active)setError(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[movieId]);
 if(loading)return <p className={css.status}>Loading reviews...</p>;
 if(error)return <p className={css.status}>Reviews are temporarily unavailable.</p>;
 if(!reviews.length)return <div className="cine-empty"><h2>No reviews yet.</h2><p>Some stories need a little time before the audience weighs in.</p></div>;
 return <section><h3 className={css.heading}>What viewers are saying</h3><ul className={css.list}>{reviews.map(review=><li key={review.id}><div className={css.reviewTop}><div><strong>{review.author||"Anonymous viewer"}</strong><span>{review.updated_at?new Date(review.updated_at).toLocaleDateString("en-GB",{year:"numeric",month:"short",day:"numeric"}):""}</span></div>{review.author_details?.rating!=null&&<span className={css.rating}>★ {review.author_details.rating}/10</span>}</div><p>{review.content}</p></li>)}</ul></section>;
}
