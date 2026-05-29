import React, { useState } from 'react'
import { markPresent } from '../api/attendance'

export default function Attendance() {
  const [id, setId] = useState('')
  const [msg, setMsg] = useState('')

  async function handleMark() {
    try {
      const res = await markPresent(id)
      setMsg(`Marked present: ${res.studentId}`)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div>
      <input aria-label="student-id" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={handleMark}>Mark Present</button>
      <div>{msg}</div>
    </div>
  )
}
