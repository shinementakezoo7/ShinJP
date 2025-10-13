// Define user roles
export type UserRole = 'admin' | 'user' | 'pending' | 'moderator'

// Define permissions
export type Permission =
  | 'read:content'
  | 'write:content'
  | 'delete:content'
  | 'manage:users'
  | 'manage:settings'
  | 'access:admin_panel'
  | 'create:api_keys'
  | 'manage:api_keys'
  | 'access:analytics'
  | 'moderate:content'

// Define role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'read:content',
    'write:content',
    'delete:content',
    'manage:users',
    'manage:settings',
    'access:admin_panel',
    'create:api_keys',
    'manage:api_keys',
    'access:analytics',
    'moderate:content',
  ],
  moderator: [
    'read:content',
    'write:content',
    'delete:content',
    'moderate:content',
    'access:analytics',
  ],
  user: ['read:content', 'write:content'],
  pending: ['read:content'],
}

// Check if user has a specific role
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: UserRole[] = ['pending', 'user', 'moderator', 'admin']
  const userRoleIndex = roleHierarchy.indexOf(userRole)
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

  return userRoleIndex >= requiredRoleIndex
}

// Check if user has specific permission
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

// Check if user has any of the required permissions
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

// Check if user has all of the required permissions
export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

// Define API endpoint permissions
const ENDPOINT_PERMISSIONS: Record<string, Permission> = {
  '/api/admin/users': 'manage:users',
  '/api/admin/settings': 'manage:settings',
  '/api/admin/analytics': 'access:analytics',
  '/api/content/delete': 'delete:content',
  '/api/content/moderate': 'moderate:content',
  '/api/keys/create': 'create:api_keys',
  '/api/keys/manage': 'manage:api_keys',
}

// Check if user can access specific endpoint
export const canAccessEndpoint = (userRole: UserRole, endpoint: string): boolean => {
  const requiredPermission = ENDPOINT_PERMISSIONS[endpoint]

  // If no specific permission is required for this endpoint, allow access
  if (!requiredPermission) {
    return true
  }

  return hasPermission(userRole, requiredPermission)
}

// Define feature permissions
const FEATURE_PERMISSIONS: Record<string, Permission> = {
  admin_panel: 'access:admin_panel',
  user_management: 'manage:users',
  settings_management: 'manage:settings',
  analytics_dashboard: 'access:analytics',
  content_moderation: 'moderate:content',
  api_key_management: 'manage:api_keys',
}

// Check if user can access specific feature
export const canAccessFeature = (userRole: UserRole, feature: string): boolean => {
  const requiredPermission = FEATURE_PERMISSIONS[feature]

  // If no specific permission is required for this feature, allow access
  if (!requiredPermission) {
    return true
  }

  return hasPermission(userRole, requiredPermission)
}

// Get user permissions
export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || []
}

// Check if user is admin
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin'
}

// Check if user is moderator
export const isModerator = (userRole: UserRole): boolean => {
  return userRole === 'moderator' || userRole === 'admin'
}

// Check if user is active (not pending)
export const isActiveUser = (userRole: UserRole): boolean => {
  return userRole !== 'pending'
}
