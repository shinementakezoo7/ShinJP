'use client'

import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    {
      id: 1,
      name: 'Lessons Completed',
      value: '12',
      change: '+4',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      gradient: 'from-indigo-500 to-purple-600',
      link: '/lessons',
    },
    {
      id: 2,
      name: 'Words Learned',
      value: '342',
      change: '+23',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-green-500 to-emerald-600',
      link: '/vocabulary',
    },
    {
      id: 3,
      name: 'Study Streak',
      value: '7 days',
      change: '+1',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-yellow-500 to-orange-600',
      link: '/study',
    },
    {
      id: 4,
      name: 'JLPT Progress',
      value: 'N3',
      change: '+15%',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      gradient: 'from-pink-500 to-red-600',
      link: '/progress',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Completed Lesson: Hiragana Basics',
      status: 'Completed',
      score: '95%',
      time: '2 hours ago',
      color: 'green',
    },
    {
      id: 2,
      title: 'Practiced Kanji Writing',
      status: 'Completed',
      score: '15 characters',
      time: 'Yesterday',
      color: 'green',
    },
    {
      id: 3,
      title: 'Joined Study Group: JLPT N3 Prep',
      status: 'New',
      score: '12 members',
      time: '2 days ago',
      color: 'blue',
    },
  ]

  const quickActions = [
    {
      name: 'Start Lesson',
      description: 'Continue learning',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      link: '/lessons',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      name: 'AI Books',
      description: 'Generate & read',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      link: '/books',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Chat',
      description: 'AI conversation',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      link: '/chat',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Practice',
      description: 'Drills & exercises',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      link: '/practice',
      gradient: 'from-green-500 to-emerald-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="japanese-text gradient-text text-4xl sm:text-5xl lg:text-6xl">
                道場
              </span>
              Dashboard
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-medium">
              Welcome back to your{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-300">dojo</span>! Ready to
              learn?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={stat.id}
            href={stat.link}
            className={`card-hover animate-slide-up stagger-${index + 1}`}
          >
            <div className="relative futuristic-card glass-morphism rounded-2xl p-6 overflow-hidden group">
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={stat.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {stat.name}
                </h3>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2 animate-slide-in-left">
          <div className="futuristic-card glass-morphism rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`card-hover p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in stagger-${index + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                        {activity.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {activity.score}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`
                      ml-4 px-3 py-1 text-xs font-semibold rounded-full
                      ${activity.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${activity.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    `}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="animate-slide-in-right">
          <div className="futuristic-card glass-morphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={action.name}
                  href={action.link}
                  className={`card-hover block p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 group animate-fade-in stagger-${index + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={action.icon}
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {action.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8 animate-slide-up">
        <div className="futuristic-card glass-morphism rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-bold gradient-text mb-2">68%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Overall Progress</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full progress-animate"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-bold gradient-text mb-2">N3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Current Level</div>
              <div className="flex justify-center gap-2">
                {['N5', 'N4', 'N3', 'N2', 'N1'].map((level, i) => (
                  <div
                    key={level}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i <= 2
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {level.slice(-1)}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-bold gradient-text mb-2">24h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Study Time (This Week)
              </div>
              <div className="flex justify-center gap-1">
                {[3, 5, 4, 6, 3, 4, 3].map((hours, i) => (
                  <div
                    key={i}
                    className="w-6 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t"
                    style={{ height: `${hours * 10}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
