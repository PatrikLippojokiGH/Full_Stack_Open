const Course = (props) => {
    return (
      <div>
        <Header name={props.course.name} />
        <Content parts={props.course.parts} />
      </div>
      
    )
  }
  
  const Header = (props) => {
    return (
      <h2>
        {props.name}
      </h2>
    )
  }
  
  const Content = (props) => {
  
    const allExercises = 
    props.parts.reduce((sum, part) => sum+part.exercises, 0)
    console.log(allExercises)
  
    return (
        <div>
          {props.parts.map(part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
          <p><strong>total of {allExercises} exercises</strong></p>
        </div>
    )
  }
  
  const Part = (props) => {
    return (
    <p>{props.name} {props.exercises}</p> 
    ) 
  }

export default Course