import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// Example test to verify setup works
describe('Test Setup', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })
})
