const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  if (style === 'error') {
    return (
      <div className={'error'}>
        {message}
      </div>
    )
  }

  if (style === 'change') {
    return (
      <div className={'change'}>
        {message}
      </div>
    )
  }

  return (
    <div className={'message'}>
      {message}
    </div>
  )
}

export default Notification