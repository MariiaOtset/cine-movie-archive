import {NavLink} from "react-router-dom";
import {useWatchlist} from "../../context/WatchlistContext.jsx";
import css from "./Navigation.module.css";
export default function Navigation(){
 const {movies}=useWatchlist();
 const active=({isActive})=>css.link+(isActive?" "+css.active:"");
 return <header className={css.header}><nav className={css.navigation} aria-label="Main navigation">
  <NavLink className={css.brand} to="/"><span>CINÉ</span><span className={css.slash}>/</span> ARCHIVE <small>THE FILM EDIT</small></NavLink>
  <div className={css.navLinks}><NavLink end className={active} to="/">Discover</NavLink><NavLink className={active} to="/movies">Explore films</NavLink><NavLink className={active} to="/watchlist">My watchlist <span className={css.count}>{movies.length}</span></NavLink></div>
  <NavLink className={css.search} to="/movies" aria-label="Search for films"><span aria-hidden="true">⌕</span><span className={css.searchText}>Search films</span></NavLink>
 </nav></header>;
}
