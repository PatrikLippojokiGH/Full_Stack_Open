import { useState } from 'react'

// Tarvittavat palaset

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Header = (props) => {
  return (
    <h1>
      {props.text}
    </h1>
  )
}

const Anecdote = (props) => {
  return (
    <div>
    {props.list[props.ind]}
  </div>
  )
}

const Vote = (props) => {
  return (
    <div>
    has {props.voteList[props.ind]} votes
  </div>
  )
}
  

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0) // selected = indeksi näytettävälle anekdootille
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length)) // votes = taulukko, jossa pidetään äänimääriä
  const [max, setMax] = useState(0) // max = indeksi, jolla eniten ääniä

  const setRandomValue = (newValue) => {
    setSelected(newValue)
  }

  /**
   * Sattumanvarainen numero
   * @returns random numero, mutta jos meinaa tulla sama kuin valitun indeksi, palautetaan 0
   */
  const getNewRandom = () => {
    let num = Math.floor(Math.random() * 8);

    if (num === selected) {
      if (num + 1 > 7) num = 0
      else num = num + 1
    }

    return num
  }

  /**
   * Äänen lisäys ja eniten ääniä saaneen tarkistus ja muuttaminen
   */
  const addVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    const newMax = copy.indexOf(Math.max(...copy))
    if (copy[newMax] > copy[max]) {
      setMax(newMax) // Se joka saa ensimmäisenä suurimman määrän ääniä näytetään, jos kahdella sama äänimäärä
    }
    setVotes(copy)
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote list={anecdotes} ind={selected} />
      <Vote voteList={votes} ind={selected} />
      <Button handleClick={() => addVote()} text = "Vote" />
      <Button handleClick={() => setRandomValue(getNewRandom)} text = "Next Anecdote" />
      <Header text="Anecdote with the most votes" />
      <Anecdote list={anecdotes} ind={max} />
      <Vote voteList={votes} ind={max} />
    </div>
  )
}

export default App