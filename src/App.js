import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';
import   WeatherComponent  from './features/weatherApp/component/WeatherComponent';
import Weather from './features/weatherApp/NewFolder/Weather';

function App() {
  return (
      <div>
        {/* <WeatherComponent /> */}
        <Weather></Weather>
      </div>
  );
}

export default App;
