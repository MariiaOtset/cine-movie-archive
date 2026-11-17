/**
 * TMDB returns vote_average: 0 for movies with no audience votes.
 * Missing/zero scores are not real 0/10 ratings and must never be shown as such.
 * Older locally saved watchlists might not include vote_count; keep a positive
 * average from those entries rather than discarding historical user data.
 */
export function hasMovieRating(movie) {
 const average=Number(movie?.vote_average);
 const count=movie?.vote_count;
 return Number.isFinite(average) && average>0
  && (count==null || (Number.isFinite(Number(count)) && Number(count)>0));
}
export function formatMovieRating(movie,{full=false,compact=false}={}) {
 if(!hasMovieRating(movie))return compact?"Not rated":"Not rated yet";
 return "★ "+Number(movie.vote_average).toFixed(1)+(full?" / 10":"");
}
