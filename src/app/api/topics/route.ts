import connectMongodb from '@/libs/mongodb'
import Topic from '@/models/topic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description required!' },
        { status: 400 }
      )
    }
    await connectMongodb()
    await Topic.create({ title, description })
    return NextResponse.json(
      { message: 'Topic created successfully!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/topics', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongodb()
    const topics = await Topic.find()
    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Error in GET /api/topics', error)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { message: 'Topic ID is required!' },
        { status: 400 }
      )
    }
    await connectMongodb()
    const deletedTopic = await Topic.findByIdAndDelete(id)
    if (!deletedTopic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 400 })
    }
    return NextResponse.json({ message: 'Topic deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/topics', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
