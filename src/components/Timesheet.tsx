import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TimeEntry {
  id: number
  date: string
  hours: number
  description: string
}

export function Timesheet() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [newEntry, setNewEntry] = useState<Omit<TimeEntry, 'id'>>({
    date: '',
    hours: 0,
    description: '',
  })

  const addEntry = () => {
    setEntries([...entries, { ...newEntry, id: Date.now() }])
    setNewEntry({ date: '', hours: 0, description: '' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Timesheet</h2>
      
      <div className="flex space-x-2">
        <Input
          type="date"
          value={newEntry.date}
          onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Hours"
          value={newEntry.hours}
          onChange={(e) => setNewEntry({ ...newEntry, hours: Number(e.target.value) })}
        />
        <Input
          placeholder="Description"
          value={newEntry.description}
          onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
        />
        <Button onClick={addEntry}>Add Entry</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.hours}</TableCell>
              <TableCell>{entry.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}