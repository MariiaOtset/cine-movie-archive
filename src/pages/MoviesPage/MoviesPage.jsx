import {useEffect,useMemo,useState} from "react";
import {useLocation,useSearchParams} from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList.jsx";
import MovieSkeleton from "../../components/MovieSkeleton/MovieSkeleton.jsx";
import {fetchMoviesByQuery,fetchDiscoverMovies,fetchGenres} from "../../api/movies-api.js";
import css from "./MoviesPage.module.css";
const ratings=[{label:"Any rating",value:""},{label:"7+ Excellent",value:"7"},{label:"8+ Exceptional",value:"8"}];
export default function MoviesPage(){
 const [params,setParams]=useSearchParams(),location=useLocation();
 const key=params.toString(),search=params.get("search")||"",genre=params.get("genre")||"",year=params.get("year")||"",rating=params.get("rating")||"";
 const [form,setForm]=useState({search,genre,year,rating}),[genres,setGenres]=useState([]);
 const [pageState,setPageState]=useState({key,page:1});
 const page=pageState.key===key?pageState.page:1;
 const [result,setResult]=useState({key:"",movies:[],pages:1,loading:false,error:false,total:0});
 const genreName=useMemo(()=>genres.find(g=>String(g.id)===genre)?.name||params.get("mood")||"All films",[genres,genre,params]);
 useEffect(()=>setForm({search,genre,year,rating}),[search,genre,year,rating]);
 useEffect(()=>{let mounted=true;fetchGenres().then(data=>{if(mounted)setGenres(data);}).catch(()=>{});return()=>{mounted=false;};},[]);
 useEffect(()=>{let active=true;setResult(prev=>({key,...(page>1&&prev.key===key?prev:{movies:[],pages:1,total:0}),loading:true,error:false}));
  async function run(){try{
    const data=search?(await fetchMoviesByQuery(search,page,{year})).data:await fetchDiscoverMovies({genre,year,minRating:rating,page});
    if(!active)return;
    const items=(data.results||[]).filter(m=>m.poster_path).filter(m=>!search||(!genre||m.genre_ids?.includes(Number(genre)))&&(!rating||Number(m.vote_average)>=Number(rating)));
    setResult(prev=>({key,movies:page===1||prev.key!==key?items:[...prev.movies,...items].filter((m,i,arr)=>arr.findIndex(x=>x.id===m.id)===i),pages:Math.min(data.total_pages||1,500),total:data.total_results||0,loading:false,error:false}));
  }catch{if(active)setResult(prev=>({...prev,key,loading:false,error:true}));}}
  run();return()=>{active=false;};
 },[key,page,search,genre,year,rating]);
 const submit=e=>{e.preventDefault();const next=new URLSearchParams();if(form.search.trim())next.set("search",form.search.trim());if(form.genre)next.set("genre",form.genre);if(form.year)next.set("year",form.year);if(form.rating)next.set("rating",form.rating);setPageState({key:next.toString(),page:1});setParams(next);};
 const clear=()=>{setForm({search:"",genre:"",year:"",rating:""});setPageState({key:"",page:1});setParams({});};
 const current=result.key===key?result:{movies:[],pages:1,total:0,loading:true,error:false};
 return <main className={css.page}>
  <div className={css.hero}><p className="cine-eyebrow">THE COLLECTION / EXPLORE</p><h1 className="cine-page-title">Your next great <em>watch.</em></h1><p>Search thousands of films, follow a feeling, and find the stories worth staying in for.</p><div className={css.heroSide}>CINÉ / ARCHIVE<br/>ISSUE Nº 001</div></div>
  <form className={css.filters} onSubmit={submit} role="search"><label className={css.searchLabel}>FIND A FILM <input placeholder="Search by title..." value={form.search} onChange={e=>setForm(s=>({...s,search:e.target.value}))}/></label><label>GENRE <select value={form.genre} onChange={e=>setForm(s=>({...s,genre:e.target.value}))}><option value="">All genres</option>{genres.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label><label>RELEASE YEAR <input type="number" min="1900" max="2100" placeholder="Any year" value={form.year} onChange={e=>setForm(s=>({...s,year:e.target.value}))}/></label><label>RATING <select value={form.rating} onChange={e=>setForm(s=>({...s,rating:e.target.value}))}>{ratings.map(r=><option value={r.value} key={r.value}>{r.label}</option>)}</select></label><button type="submit" className={css.submit}>Discover <span aria-hidden="true">↗</span></button></form>
  <div className={css.toolbar}><div><p className="cine-eyebrow">CURATED DISCOVERY</p><h2 className="cine-serif">{search?"Results for “"+search+"”":genreName}</h2><p>{search&&genre||search&&rating?"Additional genre and rating filters refine the results loaded so far.": "Explore the collection or tailor the filters above."}</p></div><button type="button" onClick={clear}>Clear filters <span aria-hidden="true">×</span></button></div>
  {current.error&&<div className="cine-error">The archive could not load. Please check your connection and try again.</div>}
  {current.loading&&current.movies.length===0?<MovieSkeleton/>:<MovieList movies={current.movies} state={{from:location}}/>}
  {!current.loading&&!current.error&&current.movies.length===0&&<div className="cine-empty"><h2>No films found in these results.</h2><p>Try a different title or a broader filter. You can also load more pages to explore further.</p><button type="button" className="cine-button" onClick={clear}>Reset discovery ↗</button></div>}
  {!current.error&&page<current.pages&&<div className={css.more}><button type="button" disabled={current.loading} onClick={()=>setPageState({key,page:page+1})}>{current.loading?"Loading films...":"Load more films"} <span aria-hidden="true">↓</span></button></div>}
 </main>;
}
