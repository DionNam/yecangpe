'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  language: string
  category: string
  author_name: string
  thumbnail_url: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  view_count: number
}

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const CATEGORIES = [
  { code: 'tips', label: '취업 팁' },
  { code: 'visa', label: '비자 가이드' },
  { code: 'korean', label: '한국어 학습' },
  { code: 'news', label: '뉴스' },
  { code: 'guide', label: '가이드' },
  { code: 'general', label: '일반' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    + '-' + Math.random().toString(16).slice(2, 8)
}

export function AdminBlogClient({ posts: initialPosts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [language, setLanguage] = useState('ko')
  const [category, setCategory] = useState('general')
  const [authorName, setAuthorName] = useState('HangulJobs')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const resetForm = () => {
    setTitle('')
    setContent('')
    setExcerpt('')
    setLanguage('ko')
    setCategory('general')
    setAuthorName('HangulJobs')
    setThumbnailUrl('')
    setIsPublished(false)
  }

  const openCreate = () => {
    resetForm()
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (post: BlogPost) => {
    setTitle(post.title)
    setContent(post.content)
    setExcerpt(post.excerpt || '')
    setLanguage(post.language)
    setCategory(post.category)
    setAuthorName(post.author_name)
    setThumbnailUrl(post.thumbnail_url || '')
    setIsPublished(post.is_published)
    setEditing(post)
    setCreating(true)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 입력하세요')
    setSaving(true)

    const payload = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().slice(0, 150),
      language,
      category,
      author_name: authorName.trim() || 'HangulJobs',
      thumbnail_url: thumbnailUrl.trim() || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    }

    if (editing) {
      const { error } = await (supabase as any)
        .from('blog_posts')
        .update(payload)
        .eq('id', editing.id)

      if (error) {
        alert('수정 실패: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const slug = generateSlug(title)
      const { error } = await (supabase as any)
        .from('blog_posts')
        .insert({ ...payload, slug })

      if (error) {
        alert('저장 실패: ' + error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setCreating(false)
    setEditing(null)
    router.refresh()
    // Refetch
    const { data } = await (supabase as any)
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await (supabase as any).from('blog_posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  const togglePublish = async (post: BlogPost) => {
    const newState = !post.is_published
    await (supabase as any)
      .from('blog_posts')
      .update({
        is_published: newState,
        published_at: newState ? new Date().toISOString() : null,
      })
      .eq('id', post.id)
    setPosts(posts.map(p => p.id === post.id ? { ...p, is_published: newState } : p))
  }

  if (creating) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => { setCreating(false); setEditing(null) }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </button>

          <h1 className="text-2xl font-bold mb-6">{editing ? '글 수정' : '새 글 작성'}</h1>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="블로그 글 제목" />
            </div>

            {/* Language + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">언어</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10">
                  {CATEGORIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Author + Thumbnail row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
                <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="HangulJobs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 URL (선택)</label>
                <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="https://..." />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">요약 (선택, 미입력 시 본문에서 자동 생성)</label>
              <input value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="한 줄 요약" />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">본문 (마크다운 지원: ##, ###, -, 1., **, *, &gt;, [text](url))</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-mono text-sm leading-relaxed"
                placeholder="블로그 본문을 작성하세요..."
              />
            </div>

            {/* Publish toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-700">즉시 발행</span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm font-medium"
              >
                {saving ? '저장 중...' : editing ? '수정 완료' : '저장'}
              </button>
              <button onClick={() => { setCreating(false); setEditing(null) }} className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 mb-2 block">Dashboard</Link>
            <h1 className="text-2xl font-bold">Blog 관리</h1>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium">
            <Plus className="w-4 h-4" /> 새 글 작성
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">아직 블로그 글이 없습니다</p>
            <p>새 글 작성 버튼을 눌러 첫 번째 글을 작성하세요</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">제목</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">언어</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">카테고리</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">조회</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 text-sm">{post.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {LANGUAGES.find(l => l.code === post.language)?.label || post.language}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {CATEGORIES.find(c => c.code === post.category)?.label || post.category}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        post.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {post.is_published ? '발행됨' : '초안'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{post.view_count}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => togglePublish(post)} className="p-2 hover:bg-gray-100 rounded-lg" title={post.is_published ? '비공개' : '발행'}>
                          {post.is_published ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => openEdit(post)} className="p-2 hover:bg-gray-100 rounded-lg" title="수정">
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg" title="삭제">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
