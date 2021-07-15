import { useState, useEffect } from 'react';
import API from '../API';
import { Movie } from '../API';

//helpers
import { isPersistedState } from '../helpers';

const initialState = {
  page: 0,
  results: [] as Movie[],
  total_pages: 0,
  total_results: 0,
};

export const useHomeFetch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (page: number, searchTerm: string = '') => {
    try {
      setError(false);
      setLoading(true);
      const movies = await API.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  // Search and init
  useEffect(() => {
    if (!searchTerm) {
      const sessionState = isPersistedState('homeState');

      if (sessionState) {
        setState(sessionState);
        return;
      }
    }

    setState(initialState);
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  //Laod More
  useEffect(() => {
    if (!isLoadingMore) return;
    setIsLoadingMore(false);
    fetchMovies(state.page + 1, searchTerm);
  }, [isLoadingMore, searchTerm, state.page]);

  //Write to sessionStorage
  useEffect(() => {
    if (!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state));
  }, [searchTerm, state]);

  return { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore };
};
