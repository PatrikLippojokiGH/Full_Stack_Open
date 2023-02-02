const Header = (props) => {
  return (
    <h1>Course: {props.course}</h1>
  )
}

const Content = (props) => {
  const parts = props.parts
  return (
      <div>
        <Part part={parts[0].part} excercises={parts[0].excersice}/>
        <Part part={parts[1].part} excercises={parts[1].excersice}/>
        <Part part={parts[2].part} excercises={parts[2].excersice}/>
      </div>
  )
}

const Part = (props) => {
  return (
  <p>{props.part} {props.excercises}</p> 
  ) 
}

const Total = (props) => {
  return (
      <p>Number of total exercises {props.totalcount}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {part: 'Fundamentals of React', excersice: 10},
    {part: 'Using props to pass data', excersice: 7},
    {part: 'State of a component', excersice: 14},
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts}/>
      <Total totalcount={parts[0].excersice + parts[1].excersice + parts[2].excersice} />
    </div>
  )
}

export default App