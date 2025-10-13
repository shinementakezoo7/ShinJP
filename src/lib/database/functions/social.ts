import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { ForumPost, GroupMembership, StudyGroup } from '../types'

// --- Study Groups ---

// Get all study groups
export const getStudyGroups = async (): Promise<StudyGroup[] | null> => {
  try {
    databaseLogger.debug('Fetching all study groups')

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching study groups', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched study groups', { count: data?.length || 0 })
    return data as StudyGroup[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching study groups', {}, error as Error)
    return null
  }
}

// Get study group by ID
export const getStudyGroupById = async (id: number): Promise<StudyGroup | null> => {
  try {
    databaseLogger.debug('Fetching study group by ID', { id })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase.from('study_groups').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Study group not found', { id })
        return null
      }
      databaseLogger.error('Error fetching study group by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched study group by ID', { id })
    return data as StudyGroup
  } catch (error) {
    databaseLogger.error('Unexpected error fetching study group by ID', { id }, error as Error)
    return null
  }
}

// Get study groups by user membership
export const getStudyGroupsByUser = async (userId: string): Promise<StudyGroup[] | null> => {
  try {
    databaseLogger.debug('Fetching study groups by user', { userId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('study_groups')
      .select('study_groups(*)')
      .eq('group_memberships.user_id', userId)
      .order('study_groups.created_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user study groups', {
        userId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    // Extract study groups from the join result
    const groups = data.map((item: { study_groups: StudyGroup }) => item.study_groups)
    databaseLogger.info('Successfully fetched study groups by user', {
      userId,
      count: groups.length,
    })
    return groups
  } catch (error) {
    databaseLogger.error('Unexpected error fetching user study groups', { userId }, error as Error)
    return null
  }
}

// Create a new study group
export const createStudyGroup = async (
  group: Omit<StudyGroup, 'id' | 'member_count' | 'created_at' | 'updated_at'>,
  creatorId: string
): Promise<StudyGroup | null> => {
  try {
    databaseLogger.debug('Creating new study group', { group, creatorId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    // Create the study group
    const { data: groupData, error: groupError } = await supabase
      .from('study_groups')
      .insert([
        {
          ...group,
          created_by: creatorId,
          member_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (groupError) {
      databaseLogger.error('Error creating study group', {
        group,
        creatorId,
        error: groupError.message,
        code: groupError.code,
      })
      return null
    }

    const studyGroup = groupData as StudyGroup

    // Add creator as admin member
    const { error: membershipError } = await supabase.from('group_memberships').insert([
      {
        user_id: creatorId,
        group_id: studyGroup.id,
        role: 'admin',
        joined_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ])

    if (membershipError) {
      databaseLogger.error('Error adding creator to group', {
        creatorId,
        groupId: studyGroup.id,
        error: membershipError.message,
        code: membershipError.code,
      })
      // Note: In a production app, you might want to delete the group if this fails
    }

    databaseLogger.info('Successfully created study group', { id: studyGroup.id, creatorId })
    return studyGroup
  } catch (error) {
    databaseLogger.error(
      'Unexpected error creating study group',
      { group, creatorId },
      error as Error
    )
    return null
  }
}

// Update a study group
export const updateStudyGroup = async (
  id: number,
  updates: Partial<StudyGroup>
): Promise<StudyGroup | null> => {
  try {
    databaseLogger.debug('Updating study group', { id, updates })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('study_groups')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating study group', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Study group not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated study group', { id })
    return data as StudyGroup
  } catch (error) {
    databaseLogger.error('Unexpected error updating study group', { id, updates }, error as Error)
    return null
  }
}

// Delete a study group
export const deleteStudyGroup = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting study group', { id })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return false
    }

    const { error } = await supabase.from('study_groups').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting study group', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted study group', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting study group', { id }, error as Error)
    return false
  }
}

// --- Group Memberships ---

// Get group memberships for a user
export const getUserGroupMemberships = async (
  userId: string
): Promise<GroupMembership[] | null> => {
  try {
    databaseLogger.debug('Fetching user group memberships', { userId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('group_memberships')
      .select('*')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user group memberships', {
        userId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user group memberships', {
      userId,
      count: data?.length || 0,
    })
    return data as GroupMembership[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user group memberships',
      { userId },
      error as Error
    )
    return null
  }
}

// Get members of a study group
export const getGroupMembers = async (groupId: number): Promise<GroupMembership[] | null> => {
  try {
    databaseLogger.debug('Fetching group members', { groupId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('group_memberships')
      .select(
        `
        *,
        user:users(full_name, username, avatar_url)
      `
      )
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching group members', {
        groupId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched group members', { groupId, count: data?.length || 0 })
    return data as GroupMembership[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching group members', { groupId }, error as Error)
    return null
  }
}

// Join a study group
export const joinStudyGroup = async (
  userId: string,
  groupId: number
): Promise<GroupMembership | null> => {
  try {
    databaseLogger.debug('Joining study group', { userId, groupId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    // Check if user is already a member
    const { data: existingMembership, error: fetchError } = await supabase
      .from('group_memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      databaseLogger.error('Error checking existing membership', {
        userId,
        groupId,
        error: fetchError.message,
        code: fetchError.code,
      })
      return null
    }

    if (existingMembership) {
      databaseLogger.debug('User already member of group', { userId, groupId })
      return existingMembership as GroupMembership
    }

    // Add user to group as member
    const { data, error } = await supabase
      .from('group_memberships')
      .insert([
        {
          user_id: userId,
          group_id: groupId,
          role: 'member',
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error joining study group', {
        userId,
        groupId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    // Increment group member count
    const { error: updateError } = await supabase
      .from('study_groups')
      .update({
        member_count: supabase.rpc('increment_member_count', { group_id: groupId }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId)

    if (updateError) {
      databaseLogger.warn('Error updating group member count', {
        groupId,
        error: updateError.message,
        code: updateError.code,
      })
    }

    databaseLogger.info('Successfully joined study group', {
      userId,
      groupId,
      membershipId: data.id,
    })
    return data as GroupMembership
  } catch (error) {
    databaseLogger.error(
      'Unexpected error joining study group',
      { userId, groupId },
      error as Error
    )
    return null
  }
}

// Leave a study group
export const leaveStudyGroup = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Leaving study group', { userId, groupId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return false
    }

    const { error } = await supabase
      .from('group_memberships')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId)

    if (error) {
      databaseLogger.error('Error leaving study group', {
        userId,
        groupId,
        error: error.message,
        code: error.code,
      })
      return false
    }

    // Decrement group member count
    const { error: updateError } = await supabase
      .from('study_groups')
      .update({
        member_count: supabase.rpc('decrement_member_count', { group_id: groupId }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId)

    if (updateError) {
      databaseLogger.warn('Error updating group member count', {
        groupId,
        error: updateError.message,
        code: updateError.code,
      })
    }

    databaseLogger.info('Successfully left study group', { userId, groupId })
    return true
  } catch (error) {
    databaseLogger.error(
      'Unexpected error leaving study group',
      { userId, groupId },
      error as Error
    )
    return false
  }
}

// --- Forum Posts ---

// Get forum posts for a group
export const getForumPostsByGroup = async (
  groupId: number,
  parentId: number | null = null
): Promise<ForumPost[] | null> => {
  try {
    databaseLogger.debug('Fetching forum posts by group', { groupId, parentId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    let query = supabase
      .from('forum_posts')
      .select(
        `
        *,
        user:users(full_name, username, avatar_url)
      `
      )
      .eq('group_id', groupId)

    if (parentId === null) {
      // Get top-level posts only
      query = query.is('parent_post_id', null)
    } else if (parentId > 0) {
      // Get replies to a specific post
      query = query.eq('parent_post_id', parentId)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      databaseLogger.error('Error fetching forum posts', {
        groupId,
        parentId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched forum posts', {
      groupId,
      parentId,
      count: data?.length || 0,
    })
    return data as ForumPost[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching forum posts',
      { groupId, parentId },
      error as Error
    )
    return null
  }
}

// Get a specific forum post
export const getForumPostById = async (id: number): Promise<ForumPost | null> => {
  try {
    databaseLogger.debug('Fetching forum post by ID', { id })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .select(
        `
        *,
        user:users(full_name, username, avatar_url)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Forum post not found', { id })
        return null
      }
      databaseLogger.error('Error fetching forum post by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched forum post by ID', { id })
    return data as ForumPost
  } catch (error) {
    databaseLogger.error('Unexpected error fetching forum post by ID', { id }, error as Error)
    return null
  }
}

// Create a new forum post
export const createForumPost = async (
  post: Omit<ForumPost, 'id' | 'likes_count' | 'created_at' | 'updated_at'>
): Promise<ForumPost | null> => {
  try {
    databaseLogger.debug('Creating new forum post', { post })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert([
        {
          ...post,
          likes_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        user:users(full_name, username, avatar_url)
      `
      )
      .single()

    if (error) {
      databaseLogger.error('Error creating forum post', {
        post,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created forum post', { id: data.id })
    return data as ForumPost
  } catch (error) {
    databaseLogger.error('Unexpected error creating forum post', { post }, error as Error)
    return null
  }
}

// Update a forum post
export const updateForumPost = async (
  id: number,
  updates: Partial<ForumPost>
): Promise<ForumPost | null> => {
  try {
    databaseLogger.debug('Updating forum post', { id, updates })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return null
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        user:users(full_name, username, avatar_url)
      `
      )
      .single()

    if (error) {
      databaseLogger.error('Error updating forum post', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Forum post not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated forum post', { id })
    return data as ForumPost
  } catch (error) {
    databaseLogger.error('Unexpected error updating forum post', { id, updates }, error as Error)
    return null
  }
}

// Delete a forum post
export const deleteForumPost = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting forum post', { id })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return false
    }

    const { error } = await supabase.from('forum_posts').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting forum post', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted forum post', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting forum post', { id }, error as Error)
    return false
  }
}

// Like a forum post
export const likeForumPost = async (postId: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Liking forum post', { postId })

    if (!supabase) {
      databaseLogger.error('Supabase client is not available')
      return false
    }

    const { error } = await supabase
      .from('forum_posts')
      .update({
        likes_count: supabase.rpc('increment_likes', { post_id: postId }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)

    if (error) {
      databaseLogger.error('Error liking forum post', {
        postId,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully liked forum post', { postId })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error liking forum post', { postId }, error as Error)
    return false
  }
}
