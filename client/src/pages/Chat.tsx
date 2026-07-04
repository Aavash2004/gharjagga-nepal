import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'
import { Send, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Message {
  roomId: string
  message: string
  senderName: string
  senderId: number
  timestamp: string
}

interface Property {
  id: number
  title: string
  owner: { id: number; name: string }
}

export default function Chat() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [property, setProperty] = useState<Property | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const roomId = `property_${propertyId}`

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Fetch property info
    axios.get(`http://localhost:5000/api/properties/${propertyId}`)
      .then(res => setProperty(res.data.property))
      .catch(() => navigate('/properties'))

    // Connect socket
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)
    newSocket.emit('join_room', roomId)

    newSocket.on('receive_message', (data: Message) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [propertyId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !socket) return

    const messageData: Message = {
      roomId,
      message: input.trim(),
      senderName: user.name,
      senderId: user.id,
      timestamp: new Date().toISOString()
    }

    socket.emit('send_message', messageData)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px 12px 0 0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => navigate(`/properties/${propertyId}`)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500' }}>
              {property?.title || 'Loading...'}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Chat with {property?.owner.name}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          minHeight: '400px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px' }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === user.id
              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px'
                  }}>
                    {isMe ? 'You' : msg.senderName} · {formatTime(msg.timestamp)}
                  </p>
                  <div style={{
                    background: isMe ? 'var(--accent)' : 'var(--bg-surface)',
                    color: isMe ? '#FFFFFF' : 'var(--text-primary)',
                    padding: '10px 14px',
                    borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    maxWidth: '70%',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.message}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '16px',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            className="input"
            placeholder="Type a message... (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ flex: 1 }}
          />
          <button
            onClick={sendMessage}
            className="btn-primary"
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}