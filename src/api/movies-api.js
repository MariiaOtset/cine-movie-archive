import axios from "axios";

// This is a public browser-side demo. Vite variables are exposed to browser clients.
// Preserve the original public TMDB token as a fallback for the existing live demo.
const PUBLIC_DEMO_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzlhN2ZjNWNhNzZlOTc5NDQzMjMwNzZhZDc4N2Q5NiIsIm5iZiI6MTcyMDEyMTQ2Ni43MDIzMTYsInN1YiI6IjY2ODZlYTlhZmJkZmJjNTJlNjVkMmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Enyp4puO8zXKW9Kn2sZURdVVadSrbrgeYL-d3RActlg";
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: "Bearer " + (import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || PUBLIC_DEMO_TOKEN) },
  timeout: 20000,
});
export const movieImage = (path, size="w500") => path ? "https://image.tmdb.org/t/p/" + size + path : "";
export const fetchTrendingMovies = async () => (await api.get("/trending/movie/day")).data.results;
export const fetchMovieSection = async (section) => {
  if(!["popular","top_rated","upcoming"].includes(section)) throw new Error("Unknown movie section");
  return (await api.get("/movie/"+section)).data.results;
};
export const fetchMoviesByQuery = (query, page=1, filters={}) =>
  api.get("/search/movie", {params:{query,page,include_adult:false,...(filters.year?{primary_release_year:filters.year}:{})}});
export const fetchDiscoverMovies = async ({genre,year,minRating,page=1}={}) => {
 const params={page,sort_by:"popularity.desc",include_adult:false};
 if(genre)params.with_genres=genre;
 if(year)params.primary_release_year=year;
 if(minRating){params["vote_average.gte"]=minRating;params["vote_count.gte"]=100;}
 return (await api.get("/discover/movie",{params})).data;
};
export const fetchGenres = async () => (await api.get("/genre/movie/list")).data.genres;
export const fetchMovieDetails = movieId => api.get("/movie/"+encodeURIComponent(movieId),{params:{append_to_response:"videos,credits,recommendations"}});
export const fetchMovieCast = async movieId => (await api.get("/movie/"+encodeURIComponent(movieId)+"/credits")).data.cast;
export const fetchMovieReviews = async movieId => (await api.get("/movie/"+encodeURIComponent(movieId)+"/reviews")).data.results;
