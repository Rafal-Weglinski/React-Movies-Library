import { useState, useEffect } from 'react';
import API from '../API';
//Helpers
import { isPersistedState } from '../helpers';

export const useMovieFetch = (movieId) => {
  const [state, setstate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(false);

        const movie = await API.fetchMovie(movieId);
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

    const sessionState = isPersistedState(movieId);

    if (sessionState) {
      setstate(sessionState);
      setLoading(false);
      return;
    }

    fetchMovie();
  }, [movieId]);

  //Write to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(movieId, JSON.stringify(state));
  }, [movieId, state]);

  return { state, loading, error };
};
