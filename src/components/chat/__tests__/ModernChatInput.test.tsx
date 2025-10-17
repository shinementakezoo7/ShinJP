import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModernChatInput from '../ModernChatInput'
import { useSocketConnection, useChatMessages } from '@/lib/websocket/socket-client'

// Mock the hooks
jest.mock('@/lib/websocket/socket-client', () => ({
  useSocketConnection: jest.fn(() => ({ isConnected: true })),
  useChatMessages: jest.fn(() => ({ sendMessage: jest.fn() })),
  useTypingIndicators: jest.fn(() => ({ sendTypingIndicator: jest.fn() })),
}))

describe('ModernChatInput', () => {
  const mockCurrentUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    avatar: '/avatar.jpg',
    status: 'online',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with all elements', () => {
    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    expect(screen.getByPlaceholderText('メッセージを入力...')).toBeInTheDocument()
    expect(screen.getByLabelText('ファイルをアップロード')).toBeInTheDocument()
    expect(screen.getByLabelText('クイックプロンプト')).toBeInTheDocument()
    expect(screen.getByLabelText('絵文字を選択')).toBeInTheDocument()
    expect(screen.getByLabelText('音声入力')).toBeInTheDocument()
  })

  it('handles text input correctly', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()

    ;(useChatMessages as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
    })

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const textarea = screen.getByPlaceholderText('メッセージを入力...')
    await user.type(textarea, 'Hello, world!')
    expect(textarea).toHaveValue('Hello, world!')
  })

  it('handles send functionality', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()

    ;(useChatMessages as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
    })

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const textarea = screen.getByPlaceholderText('メッセージを入力...')
    const sendButton = screen.getByLabelText('メッセージを送信')

    await user.type(textarea, 'Test message')
    await user.click(sendButton)

    expect(mockSendMessage).toHaveBeenCalledWith('Test message', 'text')
  })

  it('shows reply preview when replying to message', () => {
    const replyingTo = {
      id: 'message-123',
      content: 'Original message content',
      sender: { name: 'Other User' },
    }

    render(
      <ModernChatInput
        currentUser={mockCurrentUser}
        replyingTo={replyingTo}
        onCancelReply={jest.fn()}
      />
    )

    expect(screen.getByText('Other User')).toBeInTheDocument()
    expect(screen.getByText('Original message content')).toBeInTheDocument()
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()
    const mockOnCancelReply = jest.fn()

    ;(useChatMessages as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
    })

    render(
      <ModernChatInput
        currentUser={mockCurrentUser}
        replyingTo={null}
        onCancelReply={mockOnCancelReply}
      />
    )

    const textarea = screen.getByPlaceholderText('メッセージを入力...')

    // Test send on Enter
    textarea.focus()
    await user.clear(textarea)
    await user.type(textarea, 'Test message')
    await user.keyboard('{Enter}')

    expect(mockSendMessage).toHaveBeenCalledWith('Test message', 'text')
  })

  it('handles file upload interactions', async () => {
    const user = userEvent.setup()

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const fileInput = screen.getByLabelText('ファイルをアップロード')
    const mockFile = new File(['file content'], 'test.txt', { type: 'text/plain' })

    await user.upload(fileInput, mockFile)

    expect(fileInput.files?.[0]).toBe(mockFile)
  })

  it('handles emoji picker interactions', async () => {
    const user = userEvent.setup()

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const emojiButton = screen.getByLabelText('絵文字を選択')
    await user.click(emojiButton)

    expect(screen.getByText('絵文字')).toBeInTheDocument()
  })

  it('handles quick prompts correctly', async () => {
    const user = userEvent.setup()

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const quickPromptButton = screen.getByLabelText('クイックプロンプト')
    await user.click(quickPromptButton)

    expect(screen.getByText('クイックプロンプト')).toBeInTheDocument()
  })

  it('disables input when not connected', () => {
    ;(useSocketConnection as jest.Mock).mockReturnValue({
      isConnected: false,
    })

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const textarea = screen.getByPlaceholderText('メッセージを入力...')
    expect(textarea).toBeDisabled()
  })

  it('shows character counter for longer messages', async () => {
    const user = userEvent.setup()

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const textarea = screen.getByPlaceholderText('メッセージを入力...')
    const longMessage =
      'This is a very long message that should trigger the character counter display. '.repeat(10)

    await user.type(textarea, longMessage)

    const charCount = screen.getByText((content) => content.includes('/'))
    expect(charCount).toBeInTheDocument()
  })

  it('handles drag and drop file uploads', async () => {
    const user = userEvent.setup()

    render(
      <ModernChatInput currentUser={mockCurrentUser} replyingTo={null} onCancelReply={jest.fn()} />
    )

    const dropZone = screen.getByText('メッセージを入力...').closest('div').parentElement
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

    user.upload(dropZone, mockFile)

    // Verify file upload UI appears
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument()
    })
  })
})

// Test for MessageItem component
describe('MessageItem', () => {
  it('renders message with correct structure', () => {
    // Test would go here
  })
})

// Test for MessageList component
describe('MessageList', () => {
  it('handles virtual scrolling correctly', () => {
    // Test would go here
  })
})
