"use client"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import PostScreen from "@/screens/PostScreen"
import type { NewPropertyData } from "@/components/post/PostForm"

export default function PostPage() {
  const router = useRouter()
  const currentUser = useStore((state) => state.currentUser)
  const handleCreatePost = useStore((state) => state.handleCreatePost)
  const handleAddStory = useStore((state) => state.handleAddStory)

  const handleCreatePostWrapper = async (data: NewPropertyData) => {
    try {
      if (currentUser) {
        handleCreatePost(data, currentUser)
        router.push("/home")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleAddStoryWrapper = (file: File) => {
    if (currentUser) {
      handleAddStory(file, currentUser)
    }
  }

  if (!currentUser) return null

  return <PostScreen onCreatePost={handleCreatePostWrapper} currentUser={currentUser} onAddStory={handleAddStoryWrapper} />
}
