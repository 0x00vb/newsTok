import React from 'react'

const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <h1 
          className="text-2xl font-bold text-white"
          style={{ textShadow: ' 1px 2px 2px pink' }}  
        >NewsTok</h1>
        <button
        onClick={() => alert('View bookmarked news')}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
        Bookmarks
        </button>
    </div>
  )
}

export default TopBar