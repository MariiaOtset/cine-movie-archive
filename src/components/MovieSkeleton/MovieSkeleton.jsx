import css from "./MovieSkeleton.module.css";
export default function MovieSkeleton({count=5}){return <div className={css.list} role="status" aria-label="Loading films">{Array.from({length:count},(_,i)=><div className={css.card} key={i}><div className={css.poster}/><div className={css.line}/><div className={css.short}/></div>)}</div>}
