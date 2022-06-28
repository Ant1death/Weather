'use strict';
window.addEventListener('DOMContentLoaded', () => {
    const timeEl = document.getElementById('time'),
          dateEl = document.getElementById('date'),
          currentWeatherItemsEl = document.getElementById('current__weather-items'),
          timezone = document.getElementById('timezone'),
          countryEl = document.getElementById('country'),
          weatherForecastEl = document.getElementById('weather-forecast'),
          currentTempEl = document.getElementById('current-temp'),
          days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    
    let ctx = document.querySelector('#myChart').getContext('2d');
    console.log(ctx)
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets:[{
                label: 'Weather',
                data: [23.5, 21.6, 19.4, 21.1, 19.7, 24.3, 28, 30],
                backgroundColor: [
                    'white'
                ],
                borderColor: [
                    '#000000'
                ],
                borderWidth: 3,
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'black'
                    },
                },
                y: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'black'
                    }
                },
            },
            maintainAspectRatio: true,
        }
    })
        

    const API_KEY = '3f725978163c1444a478a6815f3a2c34'

    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    getWeatherData();
    function getWeatherData () {
        let latitude = 47.233334
        let longitude = 39.700001

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=horly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data)
        })
    }

    function showWeatherData (data) {
        let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
        let otherDayForcast = ''

    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'  
    
    currentWeatherItemsEl.innerHTML =   
    `<div class="current__weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="current__weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="current__weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="current__weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="current__weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `;

    
    data.daily.forEach((day, i) => {
        if(i == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
    setInterval(() => {
        showWeatherData(data);
    }, 60000);
}

    

    setInterval(() => {
        const time = new Date();
        const month = time.getMonth();
        const date = time.getDate();
        const day = time.getDay();
        const hour = time.getHours();
        const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
        const minutes = time.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM'

        timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
        dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
    },1000);
})