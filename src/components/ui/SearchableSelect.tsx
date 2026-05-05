import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Check } from 'lucide-react'

interface SearchableSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option..."
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
    }
  }, [isOpen])

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`searchable-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "value-selected" : "placeholder"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="searchable-select-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="searchable-select-search">
              <Search size={14} className="select-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="searchable-select-list">
              {filteredOptions.length === 0 ? (
                <div className="searchable-select-empty">No results found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`searchable-select-option ${value === opt ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(opt)
                      setIsOpen(false)
                    }}
                  >
                    <span className="option-text">{opt}</span>
                    {value === opt && <Check size={14} className="check-icon" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
