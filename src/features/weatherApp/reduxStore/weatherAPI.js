import axios from 'axios';

export function todayApiCall1(cityName){
    const responseFinal = 
    axios.get(`https://api.weatherapi.com/v1/forecast.json?key=360f9c9c27f44b5284320253221812&q=${cityName}&days=7&aqi=no&alerts=no`)
    .then(response => {
        return response.data
    })
    return responseFinal
}
