import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Community() {
  const [activeTab, setActiveTab] = useState('popular')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Karthik Raja',
      avatar: '👨‍🔬',
      title: 'Drizzle patterns observation in Chennai suburbs',
      content: 'Local meteorological radar reflects high clouds saturation level. Suburbs likely to experience continuous mild drizzle for next 4 hours.',
      upvotes: 24,
      comments: 6,
      category: 'Observations'
    },
    {
      id: 2,
      author: 'Sunita Sharma',
      avatar: '👩‍🌾',
      title: 'Crop adaptation metrics advice for winter monsoon',
      content: 'We noticed loam soils are retaining water much longer this transition year. Plan your root fertilization sequence accordingly.',
      upvotes: 18,
      comments: 3,
      category: 'Agriculture'
    }
  ])

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!postTitle || !postContent) return
    const newPost = {
      id: Date.now(),
      author: 'Yashir Ahamed',
      avatar: '🤖',
      title: postTitle,
      content: postContent,
      upvotes: 1,
      comments: 0,
      category: 'Discussions'
    }
    setPosts([newPost, ...posts])
    setPostTitle('')
    setPostContent('')
  }

  const handleUpvote = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 space-y-10 select-none">
      
      {/* Centered Premium Header */}
      <motion.div {...fadeUp} className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple/10 text-3xl mb-2">👥</div>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight">
          WeatherCast <span className="gradient-text font-black">Community Grid</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base font-semibold leading-relaxed">
          Discuss weather observations, agricultural experiences, and extreme warnings with members globally.
        </p>
      </motion.div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forum feed (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-2xl">
            <div className="flex gap-2">
              {['popular', 'recent'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                    activeTab === tab ? 'bg-white/10 text-white font-extrabold shadow' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tab} Posts
                </button>
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider pr-2">{posts.length} Active topics</span>
          </div>

          {/* Posts list */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {posts.map((p) => (
                <motion.div
                  layout
                  key={p.id}
                  variants={staggerItem}
                  whileHover={{ y: -2 }}
                  className="glass p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-lg">{p.avatar}</div>
                      <div>
                        <p className="text-xs font-extrabold text-white">{p.author}</p>
                        <p className="text-[9px] text-white/45 font-bold uppercase">{p.category}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUpvote(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs font-bold rounded-xl border border-white/10 cursor-pointer"
                    >
                      ▲ <span>{p.upvotes}</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-white">{p.title}</h3>
                    <p className="text-white/70 text-xs font-medium leading-relaxed">{p.content}</p>
                  </div>

                  <div className="border-t border-white/5 pt-3 text-[10px] text-white/40 font-bold uppercase tracking-wider flex gap-4">
                    <span>💬 {p.comments} Comments</span>
                    <span>• Share topic</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Post Topic Form (Column 3) */}
        <motion.div {...fadeUp} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6">
          <h3 className="text-lg font-black text-white">Initiate Discussion Topic</h3>
          
          <form onSubmit={handlePost} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase">Topic Title</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full input-glass text-xs font-semibold"
                placeholder="Brief summary title"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase">Discussion Content</label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full h-24 input-glass text-xs font-semibold resize-none"
                placeholder="Elaborate observation details"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 btn-primary text-xs font-black tracking-wider uppercase select-none cursor-pointer"
            >
              Broadcast to community
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  )
}