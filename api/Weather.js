import axios from 'axios';

const apiKey = 'd3f0aa93ef55420098082746241404';
const Weather = {}

Weather.location = async (data) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${data.cityName}&days=${data.days}&aqi=no&alerts=no`;
    const res = await axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Weather.search = async (data) => {
    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${data.cityName}`;
    const res = await axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

export default Weather