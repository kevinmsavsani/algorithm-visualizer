import { Github, Linkedin } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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
          <label className="inline-flex items-center relative cursor-pointer">
            <input
              className="peer hidden"
              id="toggle"
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            />
            <div className="relative w-[55px] h-[25px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[20px] after:h-[20px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[2.5px] after:left-[2.5px] active:after:w-[25px] peer-checked:after:left-[52.5px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"></div>
            <svg
              height="0"
              width="50"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white peer-checked:opacity-60 absolute w-3 h-3 left-[6.5px]"
            >
              <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"></path>
            </svg>
            <svg
              height="256"
              width="256"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-3 h-3 right-[6.5px]"
            >
              <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"></path>
            </svg>
          </label>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
