import { faker } from '@faker-js/faker'

// Mock user data factory
export interface MockUser {
  id: string
  name: string
  email: string
  avatar: string
  createdAt: Date
  lastLogin: Date
  jlptLevel: number
  sswSector?: string
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }
}

export const createUser = (overrides: Partial<MockUser> = {}): MockUser => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
    lastLogin: faker.date.recent(),
    jlptLevel: faker.number.int({ min: 5, max: 1 }),
    sswSector: faker.helpers.arrayElement([
      'nursing-care',
      'building-cleaning',
      'construction',
      'food-service',
      'agriculture',
      undefined,
    ]),
    preferences: {
      theme: faker.helpers.arrayElement(['light', 'dark']) as 'light' | 'dark',
      notifications: faker.datatype.boolean(),
      language: 'en',
      ...overrides.preferences,
    },
    ...overrides,
  }
}

export const createUsers = (count: number): MockUser[] => {
  return Array.from({ length: count }, () => createUser())
}
