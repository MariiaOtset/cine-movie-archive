import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";
const WatchlistContext=createContext(null);
const STORAGE="cine-archive-watchlist-v1";
function readStored(){try{const data=JSON.parse(localStorage.getItem(STORAGE)||"[]");return Array.isArray(data)?data.filter(item=>item&&item.id):[];}catch{return [];}}
export function WatchlistProvider({children}){
 const [movies,setMovies]=useState(readStored);
 useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(movies));}catch{/* Storage may be unavailable. */}},[movies]);
 useEffect(()=>{const sync=e=>{if(e.key===STORAGE)setMovies(readStored());};window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync);},[]);
 const toggle=useCallback(movie=>setMovies(prev=>prev.some(m=>m.id===movie.id)?prev.filter(m=>m.id!==movie.id):[...prev,{id:movie.id,title:movie.title,poster_path:movie.poster_path,backdrop_path:movie.backdrop_path,release_date:movie.release_date,vote_average:movie.vote_average,genre_ids:movie.genre_ids||[]}]),[]);
 const contains=useCallback(id=>movies.some(m=>m.id===id),[movies]);
 const value=useMemo(()=>({movies,toggle,contains}),[movies,toggle,contains]);
 return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}
export function useWatchlist(){const ctx=useContext(WatchlistContext);if(!ctx)throw new Error("WatchlistProvider missing");return ctx;}
