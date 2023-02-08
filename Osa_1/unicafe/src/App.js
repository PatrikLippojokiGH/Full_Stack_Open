import React,{ useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {

  const good = props.good
  const neutral = props.neutral
  const bad = props.bad

  if (sum(good, neutral, bad) === 0) return (
      <div>No feedback given</div>
  )  
  return (
  <table>
    <tbody>
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={sum(good, neutral, bad)} />
      <StatisticLine text="average" value ={average(good, neutral, bad)} />
      <StatisticLine text="positive" value ={positive(good,neutral,bad)} />
    </tbody>
  </table>
  )
}

const StatisticLine = (props) => {
  if (props.text === "positive") return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value} %</td>
   </tr>
  )
  return (
   <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
   </tr>
  )
}

const sum = (g,n,b) => g + n + b

const average = (g,n,b) => (g - b) / sum(g,n,b)

const positive = (g,n,b) => g/(g + n + b) * 100


const App = (props) => {
  const [goodValue, setGood] = useState(0)
  const [neutralValue, setNeutral] = useState(0)
  const [badValue, setBad] = useState(0)

  const incrementGood = () => setGood(goodValue + 1)
  const incrementNeutral = () => setNeutral(neutralValue + 1)
  const incrementBad = () => setBad(badValue + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => incrementGood()} text="good" />
      <Button handleClick={() => incrementNeutral()} text="neutral" />
      <Button handleClick={() => incrementBad()} text="bad" />
      <h1>statistics</h1>
      <Statistics good={goodValue} neutral = {neutralValue} bad = {badValue}/>
    </div>
  )
}

export default App