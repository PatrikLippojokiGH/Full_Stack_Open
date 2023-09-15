import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'This is the title string',
    author: 'This is the author string',
    url: 'this is the url string',
    likes: '0'
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')

  screen.debug(div)

  expect(div).toHaveTextContent('This is the title string')
  expect(div).not.toHaveTextContent('this is the url string')
  expect(div).not.toHaveTextContent('0')

})

test('clickin view renders more info', async () => {
  const blog = {
    title: 'This is the title string',
    author: 'This is the author string',
    url: 'this is the url string',
    likes: '0',
    user: {
      name: 'Test User'
    }
  }

  const loggedUser = { // Ei taideta vielä tarvita
    name: 'Test User'
  }

  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} loggedUser={loggedUser}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')

  screen.debug(div)

  expect(div).toHaveTextContent('This is the title string')
  expect(div).toHaveTextContent('this is the url string')
  expect(div).toHaveTextContent('0')
  expect(div).toHaveTextContent('Test User')
})

test('clicking like twice causes 2 calls', async () => {
  const blog = {
    title: 'This is the title string',
    author: 'This is the author string',
    url: 'this is the url string',
    likes: '0',
    user: {
      name: 'Test User'
    }
  }

  const loggedUser = { // Ei taideta vieläkään tarvita
    name: 'Test User'
  }

  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} loggedUser={loggedUser} likeBlog={mockHandler}/>
  )

  const user = userEvent.setup()
  const buttonView = screen.getByText('view')
  await user.click(buttonView)

  const div = container.querySelector('.blog')

  screen.debug(div)

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  screen.debug(div)

  expect(mockHandler.mock.calls).toHaveLength(2)
})