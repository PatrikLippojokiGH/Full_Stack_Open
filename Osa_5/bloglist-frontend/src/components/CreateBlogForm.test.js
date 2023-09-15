import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test( 'Creating a new blog with <CreateBlogForm /> calls the create function with the right information', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url'
  }
  render(<CreateBlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('title')
  const inputAuthor = screen.getByPlaceholderText('author')
  const inputUrl = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'test title')
  await user.type(inputAuthor, 'test author')
  await user.type(inputUrl, 'test url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})