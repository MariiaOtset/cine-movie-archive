import test from "node:test";
import assert from "node:assert/strict";
import {formatMovieRating,hasMovieRating} from "./movieRating.js";
test("valid TMDB rating is preserved",()=>{
 assert.equal(hasMovieRating({vote_average:8.64,vote_count:112}),true);
 assert.equal(formatMovieRating({vote_average:8.64,vote_count:112}),"★ 8.6");
 assert.equal(formatMovieRating({vote_average:8.64,vote_count:112},{full:true}),"★ 8.6 / 10");
});
test("zero-score upcoming movie is not mislabelled as zero stars",()=>{
 const upcoming={vote_average:0,vote_count:0};
 assert.equal(hasMovieRating(upcoming),false);
 assert.equal(formatMovieRating(upcoming),"Not rated yet");
 assert.equal(formatMovieRating(upcoming,{compact:true}),"Not rated");
});
test("missing, invalid, and non-voted ratings are not displayed numerically",()=>{
 for(const movie of [{},{vote_average:null},{vote_average:"NaN"},{vote_average:7.4,vote_count:0},{vote_average:0.0,vote_count:99}]){
  assert.equal(hasMovieRating(movie),false);
  assert.equal(formatMovieRating(movie,{full:true}),"Not rated yet");
 }
});
test("legacy saved watchlist without vote_count keeps a valid average",()=>{
 assert.equal(formatMovieRating({vote_average:7.8}),"★ 7.8");
});
