'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

export default function AddTopic() {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const router = useRouter()
  const { status, data: session } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !description) {
      alert('Title and Description을 모두 입력하세요')
      return
    }

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })
      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        throw new Error('Failed to add topic')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'unauthenticated' ? (
        <p>Redirecting to login...</p>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border border-slate-500 p-4"
            placeholder="Topic Title"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            value={title}
          />
          <textarea
            className="border border-slate-500 p-4 h-32"
            placeholder="Topic Description"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            value={description}
          />
          <button
            className="bg-green-800 text-white font-bold px-6 py-3 w-fit rounded-md hover:bg-green-900"
            type="submit"
          >
            Add Topic
          </button>
        </form>
      )}
    </>
  )
}
