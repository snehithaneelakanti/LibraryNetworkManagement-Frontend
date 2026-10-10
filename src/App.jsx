import { useEffect, useMemo, useState } from 'react'
import {
  Library,
  Search,
  Sun,
  Moon,
  MapPin,
  BookOpen,
  Bookmark,
  Clock3,
  MessageCircle,
  ArrowUpRight,
  X,
  Send,
  Menu,
  ChevronRight,
  CircleHelp,
  AlertCircle,
  UserRound,
  LogIn,
  LogOut,
} from 'lucide-react'
import './App.css'

import cruelPrince from './assets/books/cruel-prince.jpeg'
import howlsMovingCastle from './assets/books/howls-moving-castle.jpeg'
import dune from './assets/books/dune.jpeg'
import aminaAlSirafi from './assets/books/amina-al-sirafi.jpeg'
import smokeAndScar from './assets/books/smoke-and-scar.jpeg'
import placeForVanishing from './assets/books/place-for-vanishing.jpeg'
import lighthouseWitches from './assets/books/lighthouse-witches.jpeg'
import lute from './assets/books/lute.jpeg'
import forgeryOfFate from './assets/books/forgery-of-fate.jpeg'
import artOfDestiny from './assets/books/art-of-destiny.jpeg'
import silverCrow from './assets/books/silver-crow.jpeg'
import creatorsCall from './assets/books/creators-call.jpeg'
import nightBloodPrince from './assets/books/night-blood-prince.jpeg'
import acrossDarkSeas from './assets/books/across-dark-seas.jpeg'
import ageOfStorms from './assets/books/age-of-storms.jpeg'
import fragileEnchantement from './assets/books/fragile-enchantement.jpeg'
import songSixRealms from './assets/books/song-six-realms.jpeg'
import forgottenDawn from './assets/books/forgotten-dawn.jpeg'
import shadowsAndDust from './assets/books/shadows-and-dust.jpeg'
import prideAndPrejudice from './assets/books/pride-and-prejudice.jpeg'
import persuasion from './assets/books/persuasion.jpeg'

const coverReferences = [
  { title: 'The Cruel Prince', author: 'Holly Black', cover: cruelPrince, genre: 'Fantasy' },
  { title: 'Howl’s Moving Castle', author: 'Diana Wynne Jones', cover: howlsMovingCastle, genre: 'Fantasy' },
  { title: 'Dune', author: 'Frank Herbert', cover: dune, genre: 'Science Fiction' },
  { title: 'The Adventures of Amina al-Sirafi', author: 'Shannon Chakraborty', cover: aminaAlSirafi, genre: 'Fantasy' },
  { title: 'Smoke and Scar', author: 'Gretchen Powell Fox', cover: smokeAndScar, genre: 'Fantasy' },
  { title: 'A Place for Vanishing', author: 'Ann Fraistat', cover: placeForVanishing, genre: 'Fiction' },
  { title: 'The Lighthouse Witches', author: 'C. J. Cooke', cover: lighthouseWitches, genre: 'Mystery' },
  { title: 'Lute', author: 'Jennifer Thorne', cover: lute, genre: 'Fiction' },
  { title: 'A Forgery of Fate', author: 'Elizabeth Lim', cover: forgeryOfFate, genre: 'Fantasy' },
  { title: 'The Art of Destiny', author: 'Wesley Chu', cover: artOfDestiny, genre: 'Fantasy' },
  { title: 'The Silver Crow', author: 'Details to verify', cover: silverCrow, genre: 'Fantasy' },
  { title: 'Creator’s Call', author: 'Costas Ioannou', cover: creatorsCall, genre: 'Fantasy' },
  { title: 'The Nightblood Prince', author: 'Molly X. Chang', cover: nightBloodPrince, genre: 'Fantasy' },
  { title: 'Across Dark Seas', author: 'Clare Sager', cover: acrossDarkSeas, genre: 'Fantasy' },
  { title: 'The Age of Storms: The Veins of Eternity', author: 'Rocco Levitas', cover: ageOfStorms, genre: 'Fantasy' },
  { title: 'Un Si Fragile Enchantement', author: 'Allison Saft', cover: fragileEnchantement, genre: 'Fantasy' },
  { title: 'Song of the Six Realms', author: 'Judy I. Lin', cover: songSixRealms, genre: 'Fantasy' },
  { title: 'The Forgotten Dawn', author: 'Laura A. Blake', cover: forgottenDawn, genre: 'Fiction' },
  { title: 'Shadows & Dust', author: 'Tory Guyon', cover: shadowsAndDust, genre: 'Fiction' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', cover: prideAndPrejudice, genre: 'Classic Literature' },
  { title: 'Persuasion', author: 'Jane Austen', cover: persuasion, genre: 'Classic Literature' },
]

const sections = [
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'nearby', label: 'Nearby availability', icon: MapPin },
  { id: 'loans', label: 'My loans', icon: BookOpen },
  { id: 'holds', label: 'My holds', icon: Bookmark },
  { id: 'assistant', label: 'AI librarian', icon: MessageCircle },
]

const genres = [
  'All subjects',
  'Fantasy',
  'Classic Literature',
  'Fiction',
  'Mystery',
  'Science Fiction',
]

function App() {
  const [theme, setTheme] = useState('daylight')
  const [section, setSection] = useState('discover')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All subjects')
  const [selectedBook, setSelectedBook] = useState(null)
  const [saved, setSaved] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to the Calico Library Network. You can ask me to help discover books by subject, author, or reading mood. Live branch availability will appear here once the availability service is connected.',
    },
  ])
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('calico-user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authStatus, setAuthStatus] = useState('idle')
  const [authError, setAuthError] = useState('')

  const [apiStatus, setApiStatus] = useState('checking')
  const [catalogueBooks, setCatalogueBooks] = useState([])
  const [catalogueStatus, setCatalogueStatus] = useState('loading')
  const [catalogueError, setCatalogueError] = useState('')

  const [availabilityStatus, setAvailabilityStatus] = useState('idle')
  const [availabilityResults, setAvailabilityResults] = useState([])
  const [availabilityError, setAvailabilityError] = useState('')
  const [availabilityBook, setAvailabilityBook] = useState(null)

  // Load the catalogue from the Spring Boot backend.
  useEffect(() => {
    let active = true

    async function loadCatalogue() {
      try {
        const [healthResponse, booksResponse] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/books'),
        ])

        if (!healthResponse.ok || !booksResponse.ok) {
          throw new Error('The library API returned an error.')
        }

        const books = await booksResponse.json()

        if (!Array.isArray(books)) {
          throw new Error('The catalogue response was not a list.')
        }

        const normalizedBooks = books.map((book) => {
          const titleKey = String(book.title || '')
            .trim()
            .toLocaleLowerCase()

          const reference = coverReferences.find(
            (item) =>
              item.title.trim().toLocaleLowerCase() === titleKey
          )

          return {
            ...book,
            title: book.title || 'Untitled record',
            author: book.author || 'Author not recorded',
            cover: reference?.cover || null,
            genre: reference?.genre || 'Genre not recorded',
          }
        })

        if (active) {
          setCatalogueBooks(normalizedBooks)
          setCatalogueStatus('loaded')
          setCatalogueError('')
          setApiStatus('connected')
        }
      } catch (error) {
        if (active) {
          setCatalogueBooks([])
          setCatalogueStatus('error')
          setCatalogueError(
            error instanceof Error
              ? error.message
              : 'Unable to load the catalogue.'
          )
          setApiStatus('offline')
        }
      }
    }

    loadCatalogue()

    return () => {
      active = false
    }
  }, [])

  // Fetch availability asynchronously. State updates happen after an
  // asynchronous boundary to avoid synchronous state updates in the effect.
  useEffect(() => {
    let active = true

    async function loadAvailability() {
      await Promise.resolve()

      if (!active) return

      if (section !== 'nearby') {
        setAvailabilityStatus('idle')
        setAvailabilityResults([])
        setAvailabilityError('')
        setAvailabilityBook(null)
        return
      }

      const searchTerm = query.trim().toLocaleLowerCase()

      if (!searchTerm) {
        setAvailabilityStatus('idle')
        setAvailabilityResults([])
        setAvailabilityError('')
        setAvailabilityBook(null)
        return
      }

      const match = catalogueBooks.find((book) =>
        `${book.title} ${book.author}`
          .toLocaleLowerCase()
          .includes(searchTerm)
      )

      if (!match) {
        setAvailabilityStatus(
          catalogueStatus === 'loading' ? 'loading' : 'not-found'
        )
        setAvailabilityResults([])
        setAvailabilityError('')
        setAvailabilityBook(null)
        return
      }

      setAvailabilityStatus('loading')
      setAvailabilityResults([])
      setAvailabilityError('')
      setAvailabilityBook(match)

      try {
        const response = await fetch(
          `/api/books/${match.id}/availability`
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              'This book has no availability record yet.'
            )
          }

          throw new Error('Could not load branch availability.')
        }

        const results = await response.json()

        if (!Array.isArray(results)) {
          throw new Error(
            'The availability response was not a list.'
          )
        }

        if (active) {
          setAvailabilityResults(results)
          setAvailabilityStatus('loaded')
        }
      } catch (error) {
        if (active) {
          setAvailabilityError(
            error instanceof Error
              ? error.message
              : 'Could not load branch availability.'
          )
          setAvailabilityStatus('error')
        }
      }
    }

    loadAvailability()

    return () => {
      active = false
    }
  }, [section, query, catalogueBooks, catalogueStatus])

  // Support Escape and background-scroll locking for the book modal.
  useEffect(() => {
    if (!selectedBook) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedBook(null)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [selectedBook])

  const visibleBooks = useMemo(
    () =>
      catalogueBooks.filter((book) => {
        const matchesQuery = `${book.title} ${book.author}`
          .toLowerCase()
          .includes(query.toLowerCase())

        const matchesGenre =
          genre === 'All subjects' || book.genre === genre

        const matchesSaved =
          section !== 'holds' || saved.includes(book.id)

        return matchesQuery && matchesGenre && matchesSaved
      }),
    [catalogueBooks, query, genre, section, saved]
  )

  const navigate = (nextSection) => {
    setSection(nextSection)
    setMobileNavOpen(false)
    setSelectedBook(null)
  }

  const handleAuthentication = async (event) => {
    event.preventDefault()
    setAuthStatus('loading')
    setAuthError('')

    const isRegistering = authMode === 'register'
    const payload = isRegistering
      ? {
          name: authName.trim(),
          email: authEmail.trim(),
          password: authPassword,
        }
      : {
          email: authEmail.trim(),
          password: authPassword,
        }

    try {
      const response = await fetch(
        isRegistering ? '/api/auth/register' : '/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            (response.status === 401
              ? 'The email or password is incorrect.'
              : response.status === 409
                ? 'An account with this email already exists.'
                : 'Authentication failed. Please check your details and try again.')
        )
      }

      if (!data.token || !data.email || !data.role) {
        throw new Error(
          'The server response was incomplete. Please try again.'
        )
      }

      const user = {
        memberId: data.memberId,
        name: data.name || authName.trim() || data.email,
        email: data.email,
        role: data.role,
      }

      sessionStorage.setItem('calico-token', data.token)
      sessionStorage.setItem('calico-user', JSON.stringify(user))

      setAuthUser(user)
      setAuthPassword('')
      setAuthModalOpen(false)
      setAuthStatus('success')
      setAuthError('')
    } catch (error) {
      setAuthStatus('error')
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the authentication service.'
      )
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('calico-token')
    sessionStorage.removeItem('calico-user')
    setAuthUser(null)
    setAuthPassword('')
    setAuthError('')
    setAuthStatus('idle')
  }

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setAuthError('')
    setAuthStatus('idle')
    setAuthPassword('')
    setAuthModalOpen(true)
  }

  // Support Escape in the authentication dialog.
  useEffect(() => {
    if (!authModalOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && authStatus !== 'loading') {
        setAuthModalOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [authModalOpen, authStatus])

  
const submitChat = async (event) => {
  event.preventDefault()

  const message = chatInput.trim()
  if (!message) return

  setChatMessages((current) => [
    ...current,
    { role: 'user', text: message },
  ])
  setChatInput('')

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.message ||
        'The AI librarian is temporarily unavailable.'
      )
    }

    setChatMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: data.reply,
      },
    ])
  } catch (error) {
    setChatMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: error.message ||
          'Could not connect to the AI librarian. Please try again.',
      },
    ])
  }
}


  const toggleSaved = (id) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    )
  }

  return (
    <main className="calico-app" data-theme={theme}>
      <header className="topbar">
        <a
          className="wordmark"
          href="#home"
          onClick={() => navigate('discover')}
        >
          <span className="wordmark-icon">
            <Library size={21} strokeWidth={1.5} />
          </span>
          <span>
            CALICO <i>Library Network</i>
          </span>
        </a>

        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          className={`main-nav ${mobileNavOpen ? 'nav-open' : ''}`}
          aria-label="Library navigation"
        >
          {sections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`nav-link ${section === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="topbar-actions">
          <div className="account-controls">
            {authUser ? (
              <>
                <span className="account-label" title={authUser.email}>
                  <UserRound size={15} aria-hidden="true" />
                  <span>{authUser.name}</span>
                  <span className="account-role">{authUser.role}</span>
                </span>
                <button
                  className="account-button"
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of your account"
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <button
                className="account-button"
                type="button"
                onClick={() => openAuthModal('login')}
              >
                <LogIn size={15} />
                <span>Sign in</span>
              </button>
            )}
          </div>

          <span className={`api-indicator ${apiStatus}`}>
            <span className="api-dot" />
            {apiStatus === 'connected'
              ? 'SYSTEM ONLINE'
              : apiStatus === 'checking'
                ? 'CONNECTING'
                : 'API OFFLINE'}
          </span>

          <button
            className="theme-toggle"
            type="button"
            onClick={() =>
              setTheme((current) =>
                current === 'daylight' ? 'lamplight' : 'daylight'
              )
            }
            aria-label={`Switch to ${
              theme === 'daylight' ? 'Lamplight' : 'Daylight'
            } theme`}
          >
            {theme === 'daylight' ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
            <span>
              {theme === 'daylight' ? 'Lamplight' : 'Daylight'}
            </span>
          </button>
        </div>
      </header>

      <div className="app-shell">
        <aside
          className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}
        >
          <p className="sidebar-label">LIBRARY SERVICES</p>

          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`sidebar-link ${
                section === id ? 'selected' : ''
              }`}
              onClick={() => navigate(id)}
            >
              <Icon size={17} strokeWidth={1.6} />
              <span>{label}</span>
              {section === id && (
                <ChevronRight
                  size={14}
                  className="sidebar-chevron"
                />
              )}
            </button>
          ))}

          <div className="sidebar-divider" />
          <p className="sidebar-label">YOUR COLLECTION</p>

          <button
            className="sidebar-link"
            type="button"
            onClick={() => navigate('holds')}
          >
            <Bookmark size={17} strokeWidth={1.6} />
            <span>Saved books</span>
            <span className="sidebar-count">{saved.length}</span>
          </button>

          <div className="sidebar-note">
            <Library size={19} strokeWidth={1.4} />
            <p className="sidebar-note-title">
              One network.
              <br />
              Many shelves.
            </p>
            <p>Find a title across connected library branches.</p>
          </div>

          <div className="sidebar-help">
            <CircleHelp size={15} />
            <span>Library help</span>
          </div>
        </aside>

        <div className="main-content">
          <section className="welcome-strip">
            <div>
              <p className="eyebrow">
                <span /> CALICO LIBRARY NETWORK
              </p>

              <h1>
                {section === 'discover' ? (
                  <>
                    Find your next
                    <br />
                    <em>good read.</em>
                  </>
                ) : section === 'nearby' ? (
                  <>
                    Find it closer
                    <br />
                    <em>to home.</em>
                  </>
                ) : section === 'loans' ? (
                  <>
                    Your reading
                    <br />
                    <em>in progress.</em>
                  </>
                ) : section === 'holds' ? (
                  <>
                    Your saved
                    <br />
                    <em>library list.</em>
                  </>
                ) : (
                  <>
                    Ask the library
                    <br />
                    <em>anything.</em>
                  </>
                )}
              </h1>

              <p className="welcome-description">
                {section === 'discover' &&
                  'Search the catalogue once. Explore titles across the library network.'}
                {section === 'nearby' &&
                  'Find which branches have a copy available, then compare distances.'}
                {section === 'loans' &&
                  'Keep track of the books you have borrowed across branches.'}
                {section === 'holds' &&
                  'Keep a reading list of titles you want to find or request.'}
                {section === 'assistant' &&
                  'Get help exploring books, subjects and reading recommendations.'}
              </p>
            </div>

            <div className="welcome-aside">
              <div className="network-symbol">
                <MapPin size={21} strokeWidth={1.3} />
              </div>
              <p className="aside-label">ONE SEARCH, MANY BRANCHES</p>
              <p className="aside-quote">
                The right book, on the nearest shelf.
              </p>
              <span className="aside-footnote">
                DISCOVER · LOCATE · BORROW
              </span>
            </div>

            <span className="welcome-index">
              CALICO / LIBRARY SERVICES
            </span>
          </section>

          {section === 'discover' && (
            <section className="catalogue-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow section-eyebrow">
                    NETWORK CATALOGUE
                  </p>
                  <h2>Explore the collection.</h2>
                  <p className="section-subtitle">
                    Search by title or author to start your discovery.
                  </p>
                </div>
                <span className="result-count">
                  {visibleBooks.length} TITLES SHOWN
                </span>
              </div>

              <label className="search-box">
                <Search size={19} strokeWidth={1.6} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search books, authors or subjects..."
                  aria-label="Search the library catalogue"
                />
                {query && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <div className="catalogue-toolbar">
                <div
                  className="category-filters"
                  aria-label="Filter catalogue by subject"
                >
                  {genres.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`category-chip ${
                        genre === item ? 'selected' : ''
                      }`}
                      onClick={() => setGenre(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="book-grid">
                {visibleBooks.map((book, index) => (
                  <article
                    className="book-card"
                    key={book.id}
                    style={{ '--card-index': index }}
                  >
                    <button
                      type="button"
                      className="cover-button"
                      onClick={() => setSelectedBook(book)}
                      aria-label={`View ${book.title} catalogue record`}
                    >
                      <div className="cover-frame">
                        {book.cover ? (
                          <img
                            className="book-cover"
                            src={book.cover}
                            alt={`Cover of ${book.title}`}
                            loading={index > 5 ? 'lazy' : 'eager'}
                          />
                        ) : (
                          <BookOpen
                            size={34}
                            strokeWidth={1.2}
                            aria-label="No cover image available"
                          />
                        )}
                        <span className="cover-sheen" />
                        <span className="inspect-hint">
                          VIEW CATALOGUE RECORD
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </button>

                    <div className="book-information">
                      <div className="book-category">{book.genre}</div>
                      <h3>{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <div className="book-card-footer">
                        <span className="record-number">
                          RECORD {String(book.id).padStart(3, '0')}
                        </span>
                        <button
                          type="button"
                          className={`save-button ${
                            saved.includes(book.id) ? 'is-saved' : ''
                          }`}
                          onClick={() => toggleSaved(book.id)}
                          aria-label={`${
                            saved.includes(book.id) ? 'Remove' : 'Save'
                          } ${book.title}`}
                          title={
                            saved.includes(book.id)
                              ? 'Remove saved title'
                              : 'Save title'
                          }
                        >
                          <Bookmark
                            size={16}
                            fill={
                              saved.includes(book.id)
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {catalogueStatus === 'loading' && (
                <div className="empty-state" role="status">
                  <BookOpen size={27} strokeWidth={1.2} />
                  <h3>Loading the catalogue.</h3>
                  <p>
                    Retrieving book records from the library database.
                  </p>
                </div>
              )}

              {catalogueStatus === 'error' && (
                <div className="empty-state" role="alert">
                  <AlertCircle size={27} strokeWidth={1.2} />
                  <h3>Catalogue unavailable.</h3>
                  <p>
                    {catalogueError} Check that the backend is running,
                    then refresh the page.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              )}

              {catalogueStatus === 'loaded' &&
                visibleBooks.length === 0 && (
                  <div className="empty-state">
                    <BookOpen size={27} strokeWidth={1.2} />
                    <h3>
                      {catalogueBooks.length === 0
                        ? 'The catalogue is empty.'
                        : 'No matching titles.'}
                    </h3>
                    <p>
                      {catalogueBooks.length === 0
                        ? 'No book records have been added to the library database yet.'
                        : 'Try a different search term or subject.'}
                    </p>
                    {catalogueBooks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('')
                          setGenre('All subjects')
                        }}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
            </section>
          )}

          {section === 'nearby' && (
            <section className="service-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow section-eyebrow">
                    BRANCH AVAILABILITY
                  </p>
                  <h2>Find an available copy.</h2>
                  <p className="section-subtitle">
                    Search a title or author to see recorded copies at each branch.
                  </p>
                </div>
              </div>

              <label className="search-box availability-search">
                <Search size={19} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter a book title or author..."
                  aria-label="Search for nearby availability"
                />
                {query && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              {!query.trim() && (
                <div className="service-notice">
                  <MapPin size={20} />
                  <div>
                    <h3>Search for a book to begin</h3>
                    <p>
                      Enter a title or author. Calico will look up the catalogue
                      record and retrieve its recorded branch inventory.
                    </p>
                  </div>
                </div>
              )}

              {query.trim() && availabilityStatus === 'loading' && (
                <div className="service-empty" role="status">
                  <BookOpen size={28} />
                  <h3>Checking branch records.</h3>
                  <p>Loading the matching title and its recorded copies.</p>
                </div>
              )}

              {query.trim() && availabilityStatus === 'not-found' && (
                <div className="service-empty">
                  <Search size={28} />
                  <h3>No matching catalogue title.</h3>
                  <p>Try a different title or author name.</p>
                </div>
              )}

              {availabilityStatus === 'error' && (
                <div className="service-notice" role="alert">
                  <AlertCircle size={20} />
                  <div>
                    <h3>Availability could not be loaded</h3>
                    <p>{availabilityError}</p>
                  </div>
                </div>
              )}

              {availabilityStatus === 'loaded' && availabilityBook && (
                <>
                  <div className="availability-book-heading">
                    <div className="availability-book-cover">
                      {availabilityBook.cover ? (
                        <img
                          src={availabilityBook.cover}
                          alt={`Cover of ${availabilityBook.title}`}
                        />
                      ) : (
                        <BookOpen size={28} strokeWidth={1.2} />
                      )}
                    </div>
                    <div>
                      <p className="eyebrow">SELECTED TITLE</p>
                      <h3>{availabilityBook.title}</h3>
                      <p>by {availabilityBook.author}</p>
                    </div>
                  </div>

                  {availabilityResults.length > 0 ? (
                    <div className="availability-results">
                      {availabilityResults.map((branch) => (
                        <article
                          className="availability-result"
                          key={branch.branchId}
                        >
                          <div className="availability-result-icon">
                            <MapPin size={20} strokeWidth={1.5} />
                          </div>
                          <div className="availability-result-details">
                            <h3>{branch.branchName}</h3>
                            <p>{branch.address}</p>
                            <div className="availability-counts">
                              <span>
                                {branch.totalCopies} total{' '}
                                {branch.totalCopies === 1 ? 'copy' : 'copies'}
                              </span>
                              <span>
                                {branch.availableCopies} available
                              </span>
                            </div>
                          </div>
                          <span
                            className={`availability-status ${
                              branch.availableCopies > 0
                                ? 'available'
                                : 'unavailable'
                            }`}
                          >
                            {branch.availableCopies > 0
                              ? 'AVAILABLE'
                              : 'UNAVAILABLE'}
                          </span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="service-empty">
                      <BookOpen size={28} />
                      <h3>No copies recorded at any branch.</h3>
                      <p>
                        The catalogue contains this title, but the inventory API
                        returned no physical copies for it.
                      </p>
                    </div>
                  )}

                  <p className="service-footnote">
                    Counts come from registered physical copies. Distance sorting
                    is not shown here; the demo branch uses fictional coordinates
                    and must not be treated as a real location.
                  </p>
                </>
              )}

              <div className="availability-preview">
                <div className="preview-map">
                  <MapPin size={31} strokeWidth={1.2} />
                  <span>NETWORK MAP</span>
                  <small>
                    Map and distance ranking will be added after real branch
                    locations and a user-selected location are available.
                  </small>
                </div>
                <div className="preview-detail">
                  <p className="eyebrow">NETWORK DETAILS</p>
                  <div>
                    <MapPin size={17} />
                    <span>Branch names and addresses</span>
                  </div>
                  <div>
                    <BookOpen size={17} />
                    <span>Recorded total and available copies</span>
                  </div>
                  <div>
                    <span aria-hidden="true">—</span>
                    <span>Distance calculation — not connected yet</span>
                  </div>
                  <div>
                    <span aria-hidden="true">—</span>
                    <span>Availability from the database</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {section === 'loans' && (
            <section className="service-section">
              <p className="eyebrow section-eyebrow">MEMBER SERVICES</p>
              <h2>My loans.</h2>
              <div className="service-notice">
                <Clock3 size={20} />
                <div>
                  <h3>Loan records are not connected yet</h3>
                  <p>
                    The backend needs checkout and return endpoints before
                    this section can display real borrowed books or due dates.
                  </p>
                </div>
              </div>
              <div className="service-empty">
                <BookOpen size={28} />
                <h3>Your borrowed books will appear here.</h3>
                <p>
                  Once loan operations are connected, you can review current
                  loans and due dates.
                </p>
              </div>
            </section>
          )}

          {section === 'holds' && (
            <section className="catalogue-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow section-eyebrow">
                    YOUR READING LIST
                  </p>
                  <h2>Saved titles.</h2>
                  <p className="section-subtitle">
                    A local shortlist of books you want to find.
                  </p>
                </div>
                <span className="result-count">{saved.length} SAVED</span>
              </div>

              <label className="search-box">
                <Search size={19} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search your saved titles..."
                  aria-label="Search saved titles"
                />
              </label>

              {visibleBooks.length > 0 ? (
                <div className="book-grid">
                  {visibleBooks.map((book, index) => (
                    <article
                      className="book-card"
                      key={book.id}
                      style={{ '--card-index': index }}
                    >
                      <button
                        type="button"
                        className="cover-button"
                        onClick={() => setSelectedBook(book)}
                        aria-label={`View ${book.title}`}
                      >
                        <div className="cover-frame">
                          {book.cover ? (
                            <img
                              className="book-cover"
                              src={book.cover}
                              alt={`Cover of ${book.title}`}
                            />
                          ) : (
                            <BookOpen
                              size={34}
                              strokeWidth={1.2}
                              aria-label="No cover image available"
                            />
                          )}
                          <span className="cover-sheen" />
                          <span className="inspect-hint">
                            VIEW CATALOGUE RECORD
                            <ArrowUpRight size={13} />
                          </span>
                        </div>
                      </button>

                      <div className="book-information">
                        <div className="book-category">{book.genre}</div>
                        <h3>{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-card-footer">
                          <span className="record-number">SAVED TITLE</span>
                          <button
                            type="button"
                            className="save-button is-saved"
                            onClick={() => toggleSaved(book.id)}
                            aria-label={`Remove ${book.title} from saved titles`}
                          >
                            <Bookmark size={16} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="service-empty">
                  <Bookmark size={28} />
                  <h3>No saved titles yet.</h3>
                  <p>
                    Browse the catalogue and use the bookmark icon to keep
                    a title on your list.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('discover')}
                  >
                    Explore the catalogue
                  </button>
                </div>
              )}

              <p className="service-footnote">
                This is a browser-session shortlist, not a formal hold or
                reservation. Formal holds require the library hold-queue API.
              </p>
            </section>
          )}

          {section === 'assistant' && (
            <section className="service-section assistant-section">
              <p className="eyebrow section-eyebrow">
                CALICO AI LIBRARIAN
              </p>
              <h2>A question can open a shelf.</h2>
              <p className="section-subtitle">
                Ask for help finding your next read.
              </p>

              <div className="chat-panel">
                <div className="chat-header">
                  <span className="chat-avatar">
                    <MessageCircle size={18} />
                  </span>
                  <div>
                    <h3>Library assistant</h3>
                    <p>
                      <span className="api-dot" />
                      Catalogue-aware recommendations
                    </p>
                  </div>
                </div>

                <div className="chat-messages" aria-live="polite">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`chat-message ${message.role}`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>

                <form className="chat-form" onSubmit={submitChat}>
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask about books, authors or subjects..."
                    aria-label="Message the library assistant"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!chatInput.trim()}
                  >
                    <Send size={17} />
                  </button>
                </form>

                <p className="chat-disclaimer">
                  The AI service is not connected yet. Current replies explain
                  this limitation rather than pretending to search live data.
                </p>
              </div>
            </section>
          )}

          <footer className="site-footer">
            <a
              className="footer-wordmark"
              href="#home"
              onClick={() => navigate('discover')}
            >
              CALICO <i>Library Network</i>
            </a>
            <span>ONE NETWORK · MANY SHELVES</span>
            <span>LIBRARY SERVICES / VOL. I</span>
          </footer>
        </div>
      </div>

      {authModalOpen && (
        <div
          className="modal-backdrop auth-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              authStatus !== 'loading'
            ) {
              setAuthModalOpen(false)
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close sign-in dialog"
              disabled={authStatus === 'loading'}
            >
              <X size={19} />
            </button>

            <p className="eyebrow modal-eyebrow">
              CALICO MEMBER ACCESS <span />
            </p>
            <h2 id="auth-modal-title">
              {authMode === 'login'
                ? 'Welcome back.'
                : 'Join the network.'}
            </h2>
            <p className="auth-intro">
              {authMode === 'login'
                ? 'Sign in to your Calico Library Network account.'
                : 'Create a reader account to get started.'}
            </p>

            <form className="auth-form" onSubmit={handleAuthentication}>
              {authMode === 'register' && (
                <label className="auth-field">
                  <span>Full name</span>
                  <input
                    autoComplete="name"
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="Your name"
                    maxLength={100}
                    required
                    disabled={authStatus === 'loading'}
                  />
                </label>
              )}

              <label className="auth-field">
                <span>Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  required
                  disabled={authStatus === 'loading'}
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  autoComplete={
                    authMode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  placeholder={
                    authMode === 'register'
                      ? 'At least 8 characters'
                      : 'Your password'
                  }
                  minLength={authMode === 'register' ? 8 : undefined}
                  maxLength={72}
                  required
                  disabled={authStatus === 'loading'}
                />
              </label>

              {authError && (
                <p className="auth-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </p>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={authStatus === 'loading'}
              >
                {authStatus === 'loading'
                  ? 'PLEASE WAIT…'
                  : authMode === 'login'
                    ? 'SIGN IN'
                    : 'CREATE READER ACCOUNT'}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === 'login'
                ? 'New to Calico?'
                : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() =>
                  openAuthModal(
                    authMode === 'login' ? 'register' : 'login'
                  )
                }
                disabled={authStatus === 'loading'}
              >
                {authMode === 'login'
                  ? 'Create an account'
                  : 'Sign in'}
              </button>
            </p>

            {authMode === 'register' && (
              <p className="auth-footnote">
                New accounts receive reader access. Administrator access is
                assigned separately by the library system administrator.
              </p>
            )}
          </section>
        </div>
      )}

      {selectedBook && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBook(null)
            }
          }}
        >
          <section
            className="folio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedBook(null)}
              aria-label="Close catalogue record"
            >
              <X size={19} />
            </button>

            <div className="modal-cover-wrap">
              {selectedBook.cover ? (
                <img
                  src={selectedBook.cover}
                  alt={`Cover of ${selectedBook.title}`}
                  className="modal-cover"
                />
              ) : (
                <BookOpen
                  size={42}
                  strokeWidth={1.2}
                  aria-label="No cover image available"
                />
              )}

              <span className="modal-cover-caption">
                CALICO CATALOGUE · RECORD{' '}
                {String(selectedBook.id).padStart(3, '0')}
              </span>
            </div>

            <div className="modal-details">
              <p className="eyebrow modal-eyebrow">
                CATALOGUE RECORD <span />
              </p>
              <p className="modal-category">{selectedBook.genre}</p>
              <h2 id="modal-title">{selectedBook.title}</h2>
              <p className="modal-author">
                By <em>{selectedBook.author}</em>
              </p>
              <span className="modal-rule" />
              <p className="modal-note-label">NETWORK AVAILABILITY</p>
              <p className="modal-note">
                This record is loaded from the library database. Branch-level
                availability can be checked in the Nearby Availability section.
              </p>

              <button
                className="modal-inscribe"
                type="button"
                onClick={() => toggleSaved(selectedBook.id)}
              >
                <Bookmark size={16} />
                {saved.includes(selectedBook.id)
                  ? 'REMOVE SAVED TITLE'
                  : 'SAVE THIS TITLE'}
              </button>

              <button
                className="modal-secondary"
                type="button"
                onClick={() => {
                  setQuery(selectedBook.title)
                  navigate('nearby')
                }}
              >
                <MapPin size={16} />
                CHECK NEARBY AVAILABILITY
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App