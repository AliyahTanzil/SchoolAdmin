import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Attendance from '../src/components/Attendance'

vi.mock('../src/api/attendance', () => ({
  markPresent: (id) => Promise.resolve({ studentId: id }),
}))

test('renders input and button and marks present', async () => {
  render(<Attendance />)
  const input = screen.getByLabelText('student-id')
  fireEvent.change(input, { target: { value: 's1' } })
  const btn = screen.getByText('Mark Present')
  fireEvent.click(btn)
  const out = await screen.findByText(/Marked present:/)
  expect(out).toBeInTheDocument()
})
