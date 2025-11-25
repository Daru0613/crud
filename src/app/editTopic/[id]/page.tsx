import EditTopicForm from '@/components/EditTopicForm'
import connectMongodb from '@/libs/mongodb'
import Topic from '@/models/topic'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const getTopicById = async (id: string) => {
  try {
    await connectMongodb()
    const topic = await Topic.findById(id)
    if (!topic) {
      console.log(`Topic with id ${id} not found`)
      return null
    }
    return { topic: JSON.parse(JSON.stringify(topic)) }
  } catch (error) {
    console.log('Error in getTopicById:', error)
    return null
  }
}

export default async function EditTopic({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  const { id } = await params
  const data = await getTopicById(id)

  if (!data || !data.topic) {
    return <div>Topic not found or failed to load</div>
  }

  const { topic } = data
  const { title, description } = topic
  return <EditTopicForm id={id} title={title} description={description} />
}
