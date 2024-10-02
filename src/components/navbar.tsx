import { Github, Linkedin, MoonIcon, SunIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
  }

  return (
    <nav className="fixed w-full dark:text-white bg-gradient-to-r from-gray-300 to-slate-300 dark:from-gray-900 dark:to-black p-4 transition-colors duration-300 shadow-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <div className="flex gap-4 items-center">
            <svg
              className="w-4 h-4 text-green-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" />
            </svg>
            <span className="text-xl font-bold tracking-wide">AV</span>
          </div>
        </Link>

        <div className="flex items-center space-x-12">
          <Link
            to="#"
            className="dark:text-gray-300 text-black hover:text-white transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
          </Link>
          <Link
            to="#"
            className="dark:text-gray-300 text-black hover:text-white transition-colors duration-200"
          >
            <Linkedin className="w-4 h-4" />
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full p-0 h-6 w-6"
          >
            <SunIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
