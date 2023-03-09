import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Info = (props) => {
  console.log("maat")
  console.log(props.countries)
  console.log("sää")
  console.log(props.weather)

  if ( props.countries.length > 10 || props.countries.length === 0) return ( // Yli 10 tai 0 maata
    <div>
      Too many or no matches, specify another filter
    </div>
  )
  
  if ( props.countries.length > 1) return ( // 2-10 maata => Listataan maiden nimet
    <div>
      {props.countries.map(country =>
        <Country
          key={country.population}
          name={country.name}
          show={() => props.show(country.name)}
          />
      )}
    </div>
  )

  if (Object.keys(props.weather).length > 0) return ( // Näytetään yhden maan tiedot, kun ollaan saatu säätiedot
    <div>
      {props.countries.map((country, i) => // Käytännössä näytetään siis vain yhden maan tiedot
        <CountryWithInfo
          key={i}
          name={country.name}
          capital={country.capital}
          area={country.area}
          languages={country.languages}
          flag={country.flags.png}
          weather={props.weather}
          icon={`https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`}
        />
        )}      
    </div>    
  )}


// Maan tiedot + sää
const CountryWithInfo = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
      <div>
        capital {props.capital}
      </div>
      <div>
        area {props.area}
      </div>
      <h3>languages:</h3>
      <ul>
        {props.languages.map(language => 
          <li key={language.name}>{language.name}</li>
          )}
      </ul>
        <img src={props.flag} alt="Country flag" width="150" height="auto" border="1px solid #555"/>     
      <h2>Weather in {props.capital}</h2>
      <div>
        temperature {props.weather.main.temp} Celcius
      </div>
    <img src={props.icon} alt="weather icon" />
    <div>
      wind {props.weather.wind.speed} m/s
    </div>
    </div>
  )
}

// Maan nimi ja painike tietojen näyttämistä varten
const Country = (props) => {
  return (
    <div>
      {props.name}
      <button onClick={props.show}>show</button>
    </div>
  )
}

// Kaupungin geo tietojen haku
const getGeo = (city) => {
  const request = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`)
  return request.then(response => response.data)
}

// Säätietojen haku geo tietojen perusteella
const getWeather = (geo) => {
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${geo[0].lat}&lon=${geo[0].lon}&units=metric&appid=${api_key}`)
  return request.then(response => response.data)
}

const App = () => {
  const [value, setValue] = useState('') // Hakukenttä
  const [allCountryInfo, setAllCountryInfo] = useState([]) // Kaikkien maiden tietojen hallinta
  const [countries, setCountries] = useState([]) // Kaikkien maiden osajoukon hallintaan
  const [weather, setWeather] = useState({}) // Sää tietojen hallinta

  useEffect(() => { // Haetaan kaikkien maiden tiedot 
    console.log('fetching countries...')
    axios
      .get(`https://restcountries.com/v2/all`)
      .then(response => {
        setAllCountryInfo(response.data)
        setCountries(response.data)
      })
  },[])

  // Haetaan kaikkien maiden joukosta ne, jotka sopivat hakuun
  const handleChange = (event) => {
    setValue(event.target.value)
    const found = allCountryInfo.filter(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setCountries(found)
    if (found.length === 1) { // haetaan sää maan pääkaupungissa, kun löydettyjä maita on enää 1
      console.log('fetching geocoding...')
      console.log(found[0].capital)
      
     getGeo(found[0].capital).then(returnedGeo => {
      console.log(returnedGeo)
      console.log('fetching weather...')
      getWeather(returnedGeo).then(returnedWeather => {
        console.log(returnedWeather)
        setWeather(returnedWeather)
      })      
     })
    }
  }


  // Asetetaan maan nimen perusteella näytettävä maa ja sen säätiedot
  const showCountry = name => {
      setValue('')
      setCountries(allCountryInfo.filter(country => country.name === name))
      console.log('fetching geocoding...')
      getGeo(allCountryInfo.filter(country => country.name === name)[0].capital).then(returnedGeo => {
        console.log(returnedGeo)
        console.log('fetching weather...')
        getWeather(returnedGeo).then(returnedWeather => {
          console.log(returnedWeather)
          setWeather(returnedWeather)
        })      
       })
  }

  // Näyttö
  return (
    <div>
      <form >
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Info countries={countries} weather={weather} show={showCountry}/>
    </div>
  )
}

export default App