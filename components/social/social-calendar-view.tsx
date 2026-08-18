'use client'

import React, { useState, useEffect } from 'react'
import {
  Share2,
  Sparkles,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'

export default function SocialCalendarView() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [postType, setPostType] = useState('instagram_reel')
  const [caption, setCaption] = useState('')
  const [propertyTitle, setPropertyTitle] = useState('DLF The Aralias Penthouse')
  const [location, setLocation] = useState('Golf Course Road, Gurgaon')
  const [generatingAI, setGeneratingAI] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/social')
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleGenerateAICaption = async () => {
    try {
      setGeneratingAI(true)
      const res = await fetch('/api/social/ai-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyTitle,
          location,
          platform: postType.includes('instagram') ? 'Instagram' : 'Facebook',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCaption(data.caption)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caption) return
    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postType,
          caption,
          status: 'scheduled',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }),
      })
      setShowCreateModal(false)
      setCaption('')
      fetchPosts()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-zinc-900" /> Social Media Calendar
          </h2>
          <p className="text-xs text-zinc-500">Schedule real estate Reels, posts & AI caption helper.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Create Post
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-900" />
          Loading Social Posts...
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs hover:border-zinc-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {p.postType.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {p.status.toUpperCase()} • {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed font-medium whitespace-pre-line">{p.caption}</p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                <span>Author: {p.author?.name || 'Social Manager'}</span>
                <span className="text-zinc-950 font-bold">Ready for Zapier / Buffer dispatch</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Social Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-4 space-y-3 shadow-xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-900" /> New Social Media Draft
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-zinc-600 font-medium block mb-1">Platform / Type</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                >
                  <option value="instagram_reel">Instagram Reel</option>
                  <option value="instagram_post">Instagram Post</option>
                  <option value="facebook_post">Facebook Post</option>
                  <option value="linkedin_post">LinkedIn Post</option>
                  <option value="story">Story</option>
                </select>
              </div>

              {/* AI Generator Helper Box */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Caption Generator
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAICaption}
                    disabled={generatingAI}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold transition"
                  >
                    {generatingAI ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <input
                    type="text"
                    placeholder="Property Title"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Post Caption</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write caption or generate with AI..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-xs"
              >
                Save Post Draft
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
