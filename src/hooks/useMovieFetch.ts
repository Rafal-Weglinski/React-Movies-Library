import { useState, useEffect } from 'react';
import API from '../API';
import { Movie, Cast, Crew } from '../API';
//Helpers
import { isPersistedState } from '../helpers';

//Types
export type MovieState = Movie & { actors: Cast[]; directors: Crew[] };

export const useMovieFetch = (movieId: number) => {
  const [state, setstate] = useState<MovieState>({} as MovieState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(false);

        const movie = await API.fetchMovie(movieId.toString());
        const credits = await API.fetchCredits(movieId);
        //Get directors
        const directors = credits.crew.filter(
          (member) => member.job === 'Director'
        );

        setstate({
          ...movie,
          actors: credits.cast,
          directors,
        });

        setLoading(false);
      } catch (err) {
        setError(true);
      }
    };

    const sessionState = isPersistedState(movieId.toString());

    if (sessionState) {
      setstate(sessionState);
      setLoading(false);
      return;
    }

    fetchMovie();
  }, [movieId]);

  //Write to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(movieId.toString(), JSON.stringify(state));
  }, [movieId, state]);

  return { state, loading, error };
};
