'use client'

import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { HiPencilAlt } from 'react-icons/hi'
import RemoveBtn from './RemoveBtn'

interface Topic {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/topics')
        if (!res.ok) {
          throw new Error('failed to fetch topics')
        }
        const data = await res.json()
        setTopics(data.topics)
      } catch (error) {
        console.error('Error on loading topics')
        setError('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  if (loading) {
    return <p>Loading topics....</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (topics.length === 0) {
    return <p>No topics found</p>
  }

  return (
    <>
      {topics.map((topic: Topic) => (
        <div
          key={topic._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="text-2xl font-bold">{topic.title}</h2>
            <div>{topic.description}</div>
          </div>
          <div className="flex gap-2">
            <p>Created: {topic.createdAt}</p>
            <p>Updated: {topic.updatedAt}</p>
          </div>
          <RemoveBtn id={topic._id} />
          <Link href={`/editTopic/${topic._id}`}>
            <HiPencilAlt size={24} />
          </Link>
        </div>
      ))}
    </>
  )
}
