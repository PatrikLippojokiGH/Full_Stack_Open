import { useState } from 'react'

// Komponentit

const Persons = (props) => {
  return (
    <div>
      {props.personsToShow.map(person =>
          <Person key={person.id} person={person} />
        )}
      </div>
  )
}

const Person = ({person}) => {
  return (
    <p>{person.name} {person.number}</p>
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
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    if (persons.some(person => person.name === personObject.name)) { // Ei lisätä kahta saman nimistä
      alert(`${newName} is already added to phonebook`)
      return
    }
    debugger
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLocaleLowerCase()))
  


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonFrom onSubmit={addPerson} name={newName} nameChange={handleNameChange} number={newNumber} numChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )

}

export default App