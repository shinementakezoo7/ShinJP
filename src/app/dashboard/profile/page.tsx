'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [profile, setProfile] = useState({
    full_name: 'Guest User',
    username: 'guest',
    email: 'guest@shinmentakezo.com',
    jlpt_level: '3',
    learning_goals: ['JLPT N2', 'Business Japanese'],
    interests: ['Anime', 'Manga', 'Technology'],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferred_language: 'en',
    created_at: new Date().toISOString(),
  })

  const [formData, setFormData] = useState(profile)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayInputChange = (name: string, value: string) => {
    const arrayValues = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item)
    setFormData((prev) => ({
      ...prev,
      [name]: arrayValues,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate save
    setTimeout(() => {
      setProfile(formData)
      setIsEditing(false)
      setSaving(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-effect rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="japanese-text gradient-text text-4xl">👤</span>
                User Profile
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-gradient px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData(profile)
                }}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Full Name */}
              <div className="animate-fade-in stagger-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Username */}
              <div className="animate-fade-in stagger-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Email */}
              <div className="animate-fade-in stagger-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* JLPT Level */}
              <div className="animate-fade-in stagger-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  JLPT Level
                </label>
                <select
                  name="jlpt_level"
                  value={formData.jlpt_level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="">Select your level</option>
                  <option value="5">N5 (Beginner)</option>
                  <option value="4">N4 (Elementary)</option>
                  <option value="3">N3 (Intermediate)</option>
                  <option value="2">N2 (Upper Intermediate)</option>
                  <option value="1">N1 (Advanced)</option>
                </select>
              </div>

              {/* Learning Goals */}
              <div className="animate-fade-in stagger-5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Learning Goals
                </label>
                <input
                  type="text"
                  value={formData.learning_goals.join(', ')}
                  onChange={(e) => handleArrayInputChange('learning_goals', e.target.value)}
                  placeholder="e.g., JLPT N2, Business Japanese, Travel conversation"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple goals with commas
                </p>
              </div>

              {/* Interests */}
              <div className="animate-fade-in stagger-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Interests
                </label>
                <input
                  type="text"
                  value={formData.interests.join(', ')}
                  onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                  placeholder="e.g., Anime, Manga, Culture, Technology"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple interests with commas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timezone */}
                <div className="animate-fade-in stagger-7">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Preferred Language */}
                <div className="animate-fade-in stagger-8">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Language
                  </label>
                  <select
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="en">English</option>
                    <option value="ja">Japanese</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-gradient px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Full Name" value={profile.full_name} index={1} />
              <ProfileField label="Username" value={profile.username} index={2} />
              <ProfileField label="Email Address" value={profile.email} index={3} />
              <ProfileField
                label="JLPT Level"
                value={profile.jlpt_level ? `N${profile.jlpt_level}` : 'Not set'}
                index={4}
              />
              <ProfileField label="Timezone" value={profile.timezone} index={5} />
              <ProfileField
                label="Preferred Language"
                value={
                  profile.preferred_language === 'en'
                    ? 'English'
                    : profile.preferred_language === 'ja'
                      ? 'Japanese'
                      : profile.preferred_language === 'es'
                        ? 'Spanish'
                        : profile.preferred_language === 'fr'
                          ? 'French'
                          : profile.preferred_language === 'de'
                            ? 'German'
                            : profile.preferred_language
                }
                index={6}
              />
            </div>

            <div className="mt-6 space-y-6">
              <div className="animate-fade-in stagger-7">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Learning Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.learning_goals.map((goal, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in stagger-8">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white text-sm font-medium rounded-full shadow-lg"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in stagger-9 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Member since:</span>{' '}
                  {mounted
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : new Date(profile.created_at).toISOString().split('T')[0]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileField({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div className={`animate-fade-in stagger-${index}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</h3>
      <p className="text-base text-gray-900 dark:text-white px-4 py-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        {value || 'Not provided'}
      </p>
    </div>
  )
}
