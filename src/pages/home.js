// pages/index.js

import Navbar from '@/components/navbar';
import { useUsers } from '@/context/UsersContext';
import toLogin from '@/hoc/toLogin';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


function Home() {
  const router = useRouter();
  const { users, setUsers, currentUser, setCurrentUser } = useUsers();
  const handleUserClick = (user) => {
    const channelId = user._id;
    const joiningUserInfo = {
      email: currentUser.email,
      profilePicture: currentUser.profilePicture,
      id: currentUser.id
    }
    console.log('Joining user:', joiningUserInfo)
    router.push(`/channel/${channelId}?id=${joiningUserInfo.id}`)

  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getallusers')
        if (response.ok) {
          const usersResponse = await response.json()
          setUsers(usersResponse)
          // console.log('Fetched users:', users[0]._id)
        } else {
          console.log('Failed to fetch users')
        }
      }
      catch (err) {
        console.log('Failed to fetch users',err)
      }
    }
    fetchUsers()
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken && decodedToken.email) {
          setCurrentUser(decodedToken)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [setUsers, setCurrentUser])
  
  const sortedUsers = [...users].sort((a, b) => {
    if (a.email === currentUser) return -1;
    if (b.email === currentUser) return 1;
    return 0;
  });
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow p-4 space-y-4">
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">This Week's Streak</h2>
          <div className="flex justify-between">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-xs">{day}</span>
                <span className="w-6 h-6 bg-red-200 rounded-full mt-1"></span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="font-bold mb-2">300,000+ Active Learners</h2>
          <p>Connect with Real People</p>
          <button className="mt-2 bg-white text-blue-600 px-4 py-2 rounded">Practice Now</button>
        </section>

        <section className="bg-green-500 text-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="font-bold">AI-POWERED ENGLISH TUTOR</h2>
            <p>Personal Teacher</p>
            <button className="mt-2 bg-white text-green-500 px-4 py-2 rounded">Talk to AI</button>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">Active Users</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedUsers.map((user) => (
              <div key={user._id} className="flex flex-col items-center">
                <button
                  onClick={() => { handleUserClick(user) }}
                  className="flex flex-col items-center focus:outline-none"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 overflow-hidden hover:opacity-80 transition-opacity">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-center hover:underline">
                    {user.email === currentUser.email ? 'You' : user.username}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">More learning for you</h2>
          {/* Add your learning items here */}
        </section>
      </main>

      <nav className="bg-white p-4">
        <ul className="flex justify-around">
          {['Home', 'Learn', 'Practice', 'Chat'].map((item, index) => (
            <li key={index} className="flex flex-col items-center">
              <span className="w-6 h-6 bg-gray-300 rounded-full mb-1"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
  // return(<div>Home</div>)
}

export default toLogin(Home);
// export default Home;
