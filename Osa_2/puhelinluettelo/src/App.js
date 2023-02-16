import { useState, useEffect } from 'react'
import personService from './Services/persons'

// Komponentit

const Persons = (props) => {
  return (
    <div>
      {props.personsToShow.map(person =>
          <Person key={person.id} person={person} remove={() => props.remove(person.id)}/>
        )}
      </div>
  )
}

const Person = ({person, remove}) => {
  return (
    <p>{person.name} {person.number} <button onClick={remove}> delete</button></p>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input 
        value={props.value}
        onChange={props.onChange}            
        />
    </div>
  )
}

const PersonFrom = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
    <div>
          name: <input 
            value={props.name}
            onChange={props.nameChange}/>
        </div>
        <div>
          number: <input
            value={props.number}
            onChange={props.numChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
  
}

const App = () => {

  // Tarvittavien tilojen käsittely
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  // Tietojen haku JSON Serveriltä käynnistyessä
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons info')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(person => person.name === personObject.name)) { // Ei lisätä kahta saman nimistä
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const duplicate = {...persons.find(person => person.name === personObject.name)} 
        personService                                                // Jos halutaan antaa uusi numero olemassa olevalle henkilölle
          .update(duplicate.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== duplicate.name ? person : returnedPerson))
          })
          .catch(error => {                                          // Jos oli jo poistettu
            alert(
              `the person '${duplicate.name}' was already deleted from server`
            )
            setPersons(persons.filter(n => n.id !== duplicate.id))
          })
          return
      } else {
        return                                                       // Jos halutaan pitää vanha numero, ei tehdä mitään
      }
      
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}`)) {
      personService
      .remove(id)
      .then(setPersons(persons.filter(p => p.id !== id)))
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  // Näytetään kaikki, jos filtteri tyhjä, muuten näytetään nimen mukaan filtteröidyt
  const personsToShow = newFilter.length < 0
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonFrom onSubmit={addPerson} name={newName} nameChange={handleNameChange} number={newNumber} numChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} remove={removePerson} />
    </div>
  )

}

export default App