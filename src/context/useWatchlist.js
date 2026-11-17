import {useContext} from "react";
import {WatchlistContext} from "./watchlist-store.js";
export function useWatchlist(){const ctx=useContext(WatchlistContext);if(!ctx)throw new Error("WatchlistProvider missing");return ctx;}
