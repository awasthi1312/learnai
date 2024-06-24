// pages/index.js

import toLogin from '@/hoc/toLogin';
import Header from '../components/navbar';

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      {/* Main content */}
      <main className="flex-grow p-4 space-y-4">
        {/* Streak section */}
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

        {/* Connect with people section */}
        <section className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="font-bold mb-2">300,000+ Active Learners</h2>
          <p>Connect with Real People</p>
          <button className="mt-2 bg-white text-blue-600 px-4 py-2 rounded">Practice Now</button>
        </section>

        {/* AI tutor section */}
        <section className="bg-green-500 text-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="font-bold">AI-POWERED ENGLISH TUTOR</h2>
            <p>Personal Teacher</p>
            <button className="mt-2 bg-white text-green-500 px-4 py-2 rounded">Talk to AI</button>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </section>

        {/* More learning section */}
        <section>
          <h2 className="font-bold mb-2">More learning for you</h2>
          {/* Add your learning items here */}
        </section>
      </main>

      {/* Navigation */}
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
}

export default toLogin(Home);
