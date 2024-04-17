import React, { useEffect, useState } from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PokemonPage from './PokemonPage';
import PokemonList from './PokemonList';
import { useApi } from './useApi';

const mapResults = ({ results }) =>
  results.map(({ url, name }) => ({
    url,
    name,
    id: parseInt(url.match(/\/(\d+)\//)[1])
  }));

const App = () => {
  const match = useMatch('/pokemon/:name');
  const { data: pokemonList, error, isLoading } = useApi(
    'https://pokeapi.co/api/v2/pokemon/?limit=50',
    mapResults
  );

  // State to store the health status
  const [healthStatus, setHealthStatus] = useState(''); 

  useEffect(() => {
    axios
      .get('/health')
      .then(response => {
        if (response.data === 'ok') {
          setHealthStatus('ok');
        } else {
          setHealthStatus('not ok');
        }
      })
      .catch(error => {
        console.error('Error fetching health status:', error);
        setHealthStatus('error');
      });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  let next = null;
  let previous = null;

  if (match && match.params) {
    const pokemonId = pokemonList.find(({ name }) => name === match.params.name).id;
    previous = pokemonList.find(({ id }) => id === pokemonId - 1);
    next = pokemonList.find(({ id }) => id === pokemonId + 1);
  }

  // Check if the health status is 'ok', if so, render 'ok', otherwise render the Pokemon list or page
  return (
    <Routes>
      <Route exact path="/" element={<PokemonList pokemonList={pokemonList} />} />
      <Route exact path="/pokemon/:name" element={<PokemonPage pokemonList={pokemonList} previous={previous} next={next} />} />
      <Route exact path="/health" element={<div>{healthStatus === 'ok' ? 'ok' : 'not ok'}</div>} /> // Render 'ok' or 'not ok' based on the health status
    </Routes>
  );
};

export default App;