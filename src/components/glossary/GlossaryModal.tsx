import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, BookOpen } from 'lucide-react'
import { GLOSSARY_TERMS } from '../../data/glossary'
import { audio } from '../../utils/audio'
import './GlossaryModal.css'

interface GlossaryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredTerms = GLOSSARY_TERMS.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClose = () => {
    audio.playClick()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="glossary-overlay">
          <motion.div 
            className="glossary-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div 
            className="glossary-modal"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glossary-header">
              <div className="glossary-title">
                <div className="glossary-icon-container">
                  <BookOpen size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h2>The Quantum Lexicon</h2>
                  <p>Core Financial Concepts Database</p>
                </div>
              </div>
              <button className="glossary-close" onClick={handleClose} onMouseEnter={() => audio.playHover()}>
                <X size={20} />
              </button>
            </div>

            <div className="glossary-search-container">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                className="glossary-search" 
                placeholder="Search terms, concepts, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="glossary-content">
              {filteredTerms.length > 0 ? (
                <div className="glossary-list">
                  {filteredTerms.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="glossary-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="glossary-item-header">
                        <h3>{item.term}</h3>
                        <span className="glossary-category">{item.category.toUpperCase()}</span>
                      </div>
                      <p className="glossary-definition">{item.definition}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glossary-empty">
                  <p>No records found in the lexicon for "{searchTerm}".</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
