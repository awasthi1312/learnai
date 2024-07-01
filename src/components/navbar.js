import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('User');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setProfilePicture(decodedToken.profilePicture || '');
        setUsername(decodedToken.username || 'User');

      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">
            MyApp
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/home">Home</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/test">Practice</Link>
          <Link href="/chat">Chat</Link>
        </nav>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-gray-800">{username}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className="md:hidden bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link href="/">Home</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/practice">Practice</Link>
          <Link href="/chat">Chat</Link>
        </div>
      </nav>
    </header>
  );
}