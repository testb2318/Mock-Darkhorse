import { useState } from 'react';

export default function Footer() {
  const [showMoreIcons, setShowMoreIcons] = useState(false);
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 lg:gap-8">
          {/* Discover More Section */}
          <div className="lg:col-span-6 col-span-12 border border-dashed border-gray-700 p-6 rounded">
            <h2 className="text-white text-2xl font-bold mb-2">Discover More with Us</h2>
            <p className="text-gray-400 mb-2">
              For your inquiries or suggestions, feel free to reach out.
            </p>
            <p className="text-gray-400">
              Connect with our support team at <a href="info@Botedgitrade.coM" className="text-gray-400 hover:text-blue-400">info@Botedgitrade.com</a> and let us enhance your experience.
            </p>
          </div>
          
          {/* More for Bitronia Section */}
          <div className='lg:col-span-3 col-span-12 lg:mt-0 mt-6'>
            <h3 className="text-white text-left text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-left">
              <li><a href="#" className="text-gray-400 hover:text-blue-400">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400">Privacy</a></li>
              <li><a href="#" className="text-blue-400 hover:text-blue-300">Terms & Conditions</a></li>
            </ul>
          </div>
          
          {/* Follow on Section */}
          <div className='text-left lg:col-span-3 col-span-12 lg:mt-0 mt-6'>
            <h3 className="text-white text-lg font-semibold mb-4">Follow on</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center space-x-2 group">
                  <span className="bg-gray-800 text-blue-400 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-.868.432-1.15.83-.28.4-.42.904-.42 1.417v.04c0 .9.62 1.8 1.67 2.12 0 0 2.248.94 3.98 1.474 2.63 4.736 5.33 9.555 5.63 10.076.16.36.47.618.81.72.15.05.3.074.45.074.11 0 .21-.014.3-.04.36-.116.68-.38.84-.73.06-.136 1.26-3.097 1.7-4.64.5-1.77 1.13-3.953 1.5-5.262.78-2.754 1.62-5.53 2.15-7.33.16-.55.25-1.07.28-1.63.02-.56-.06-1.08-.42-1.49-.45-.54-1.17-.7-1.97-.71zm.83 2.24c0 .05-.02.32-.73 2.73-.7 2.41-2 6.57-3.53 11.62-.15.53-.32 1.1-.5 1.7l-1.24 4.3-.56.01-.6-1.09-.3-.55s-5.34-9.36-6.73-11.96c-.1-.2-.13-.32-.13-.32 0 0 .1-.13.33-.27.22-.13 1.06-.67 2.2-1.06 1.05-.38 2.36-.8 3.82-1.28 2.92-.97 6.37-2.1 8.57-2.94.4-.15.5-.23.5-.27z" />
                    </svg>
                  </span>
                  <span className="text-gray-300 group-hover:text-white">Telegram News</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 group">
                  <span className="bg-gray-800 text-blue-400 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-.868.432-1.15.83-.28.4-.42.904-.42 1.417v.04c0 .9.62 1.8 1.67 2.12 0 0 2.248.94 3.98 1.474 2.63 4.736 5.33 9.555 5.63 10.076.16.36.47.618.81.72.15.05.3.074.45.074.11 0 .21-.014.3-.04.36-.116.68-.38.84-.73.06-.136 1.26-3.097 1.7-4.64.5-1.77 1.13-3.953 1.5-5.262.78-2.754 1.62-5.53 2.15-7.33.16-.55.25-1.07.28-1.63.02-.56-.06-1.08-.42-1.49-.45-.54-1.17-.7-1.97-.71zm.83 2.24c0 .05-.02.32-.73 2.73-.7 2.41-2 6.57-3.53 11.62-.15.53-.32 1.1-.5 1.7l-1.24 4.3-.56.01-.6-1.09-.3-.55s-5.34-9.36-6.73-11.96c-.1-.2-.13-.32-.13-.32 0 0 .1-.13.33-.27.22-.13 1.06-.67 2.2-1.06 1.05-.38 2.36-.8 3.82-1.28 2.92-.97 6.37-2.1 8.57-2.94.4-.15.5-.23.5-.27z" />
                    </svg>
                  </span>
                  <span className="text-gray-300 group-hover:text-white">Telegram Signal</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 group">
                  <span className="bg-gray-800 text-blue-400 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </span>
                  <span className="text-gray-300 group-hover:text-white">Twitter</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 group">
                  <span className="bg-gray-800 text-red-500 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </span>
                  <span className="text-gray-300 group-hover:text-white">Youtube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-2">
            <img src="/logo.png" className="w-28"/>
            </div>
            <span className="text-gray-400 mt-4">© 2025 Botedgitrade</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-amber-500 p-2 rounded text-white">
              <span className="font-bold">B</span>
            </button>
            <button className="bg-blue-600 p-2 rounded text-white">
              <span className="font-bold">  O</span>
            </button>
            <button className="bg-red-600 p-2 rounded text-white">
              <span className="font-bold">T</span>
            </button>
            <button className="bg-amber-400 p-2 rounded text-white">
              <span className="font-bold">E</span>
            </button>
            <button className="bg-teal-500 p-2 rounded text-white">
              <span className="font-bold">T.</span>
            </button>
            {!showMoreIcons ? (
              <button 
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-white"
                onClick={() => setShowMoreIcons(true)}
              >
                +6
              </button>
            ) : (
              <>
                <button className="bg-purple-600 p-2 rounded text-white">
                  <span className="font-bold">A</span>
                </button>
                <button className="bg-green-600 p-2 rounded text-white">
                  <span className="font-bold">U</span>
                </button>
                <button className="bg-pink-600 p-2 rounded text-white">
                  <span className="font-bold">P</span>
                </button>
                <button 
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-white"
                  onClick={() => setShowMoreIcons(false)}
                >
                  -3
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}