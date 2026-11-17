import {useCallback,useEffect,useMemo,useState} from "react";
import {WatchlistContext} from "./watchlist-store.js";
const STORAGE="cine-archive-watchlist-v1",WATCHED="cine-archive-watched-v2";
function readMovies(){try{const data=JSON.parse(localStorage.getItem(STORAGE)||"[]");return Array.isArray(data)?data.filter(item=>item&&item.id):[];}catch{return [];}}
function readWatched(){try{const data=JSON.parse(localStorage.getItem(WATCHED)||"[]");return Array.isArray(data)?data.filter(id=>typeof id==="number"):[];}catch{return [];}}
export function WatchlistProvider({children}){
 const [movies,setMovies]=useState(readMovies),[watched,setWatched]=useState(readWatched);
 useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(movies));}catch{/* Storage unavailable */}},[movies]);
 useEffect(()=>{try{localStorage.setItem(WATCHED,JSON.stringify(watched));}catch{/* Storage unavailable */}},[watched]);
 useEffect(()=>{const sync=e=>{if(e.key===STORAGE)setMovies(readMovies());if(e.key===WATCHED)setWatched(readWatched());};window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync);},[]);
 const toggle=useCallback(movie=>{if(movies.some(m=>m.id===movie.id))setWatched(prev=>prev.filter(id=>id!==movie.id));setMovies(prev=>prev.some(m=>m.id===movie.id)?prev.filter(m=>m.id!==movie.id):[...prev,{id:movie.id,title:movie.title,poster_path:movie.poster_path,backdrop_path:movie.backdrop_path,release_date:movie.release_date,vote_average:movie.vote_average,vote_count:movie.vote_count,genre_ids:movie.genre_ids||[]}]);},[movies]);
 const contains=useCallback(id=>movies.some(m=>m.id===id),[movies]);
 const markWatched=useCallback(id=>setWatched(prev=>prev.includes(id)?prev.filter(key=>key!==id):[...prev,id]),[]);
 const isWatched=useCallback(id=>watched.includes(id),[watched]);
 const value=useMemo(()=>({movies,toggle,contains,watched,markWatched,isWatched}),[movies,toggle,contains,watched,markWatched,isWatched]);
 return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}