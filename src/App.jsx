import {lazy,Suspense} from "react";
import {Route,Routes} from "react-router-dom";
import Navigation from "./components/Navigation/Navigation.jsx";
import Footer from "./components/Footer/Footer.jsx";
import MovieSkeleton from "./components/MovieSkeleton/MovieSkeleton.jsx";
import {WatchlistProvider} from "./context/WatchlistContext.jsx";
import "./App.css";
const HomePage=lazy(()=>import("./pages/HomePage/HomePage.jsx"));
const MoviesPage=lazy(()=>import("./pages/MoviesPage/MoviesPage.jsx"));
const MovieDetailsPage=lazy(()=>import("./pages/MovieDetailsPage/MovieDetailsPage.jsx"));
const WatchlistPage=lazy(()=>import("./pages/WatchlistPage/WatchlistPage.jsx"));
const NotFoundPage=lazy(()=>import("./pages/NotFoundPage/NotFoundPage.jsx"));
export default function App(){return <WatchlistProvider><Navigation/><Suspense fallback={<div className="cine-container" style={{padding:"70px 0"}}><MovieSkeleton/></div>}><Routes><Route path="/" element={<HomePage/>}/><Route path="/movies" element={<MoviesPage/>}/><Route path="/movies/:movieId/*" element={<MovieDetailsPage/>}/><Route path="/watchlist" element={<WatchlistPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></Suspense><Footer/></WatchlistProvider>}
