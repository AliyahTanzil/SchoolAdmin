import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, test, expect } from 'vitest'
import Attendance from '../src/components/Attendance'

vi.mock('../src/api/attendance', () => ({
  markPresent: vi.fn((id) => Promise.resolve({ studentId: id, present: true })),
  getAttendance: vi.fn(() => Promise.resolve({ present: false })),
}))

vi.mock('../src/api/students', () => ({
  listStudents: vi.fn(() => Promise.resolve([
    { id: '1', name: 'John Doe', grade: '10th' }
  ])),
}))

vi.mock('../src/api/classes', () => ({
  listClasses: vi.fn(() => Promise.resolve([
    { id: '101', name: 'Math' }
  ])),
  listClassStudents: vi.fn(() => Promise.resolve([])),
}))

test('renders students and marks present', async () => {
  render(<Attendance />)
  
  // Wait for loading to finish
  await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())
  
  expect(screen.getByText('John Doe')).toBeInTheDocument()
  
  const btn = screen.getByText('Mark Present')
  fireEvent.click(btn)
  
  const out = await screen.findByText(/Marked present: 1/)
  expect(out).toBeInTheDocument()
})
