'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface VoiceReceptionistProps {
  businessId: string
  businessName: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Extend Window for webkit speech recognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

export default function VoiceReceptionist({ businessId, businessName }: VoiceReceptionistProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(true)
  const [mounted, setMounted] = useState(false)

  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check speech support on mount
  useEffect(() => {
    setMounted(true)
    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)

    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory, isProcessing])

  // Send greeting when first opened
  useEffect(() => {
    if (isOpen && conversationHistory.length === 0) {
      setConversationHistory([{
        role: 'assistant',
        content: `Hello! I'm the AI receptionist for ${businessName}. How can I help you today?`,
      }])
    }
  }, [isOpen, businessName, conversationHistory.length])

  function createRecognition() {
    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SpeechRecognition) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)()
    recognition.lang = 'en-NG'
    recognition.continuous = false
    recognition.interimResults = true
    return recognition
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    setError(null)
    const userMessage: ChatMessage = { role: 'user', content: text.trim() }
    setConversationHistory(prev => [...prev, userMessage])
    setIsProcessing(true)
    setInputText('')
    setCurrentTranscript('')

    try {
      const res = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          message: text.trim(),
          conversationHistory: conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant'),
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setIsProcessing(false)
        return
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.response }
      setConversationHistory(prev => [...prev, assistantMessage])
      setIsProcessing(false)

      // Speak the response
      if (speechSupported && 'speechSynthesis' in window) {
        speakText(data.response)
      }
    } catch {
      setError('Failed to get a response. Please try again.')
      setIsProcessing(false)
    }
  }, [businessId, conversationHistory, speechSupported])

  function speakText(text: string) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0

    // Try to find an English voice
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  function startListening() {
    if (!speechSupported) return

    // Stop speaking if currently speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    const recognition = createRecognition()
    if (!recognition) return

    recognitionRef.current = recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results
      const transcript = Array.from(results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join('')
      setCurrentTranscript(transcript)

      // Check if final result
      const lastResult = results[results.length - 1]
      if (lastResult.isFinal) {
        setIsListening(false)
        sendMessage(transcript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setCurrentTranscript('')
      if (event.error !== 'aborted') {
        setError('Could not hear you. Please try again or type your message.')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
      setIsListening(true)
      setError(null)
      setCurrentTranscript('')
    } catch {
      setError('Microphone access denied. Please type your message instead.')
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }

  function toggleListening() {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputText.trim() && !isProcessing) {
      sendMessage(inputText)
    }
  }

  function handleClose() {
    stopListening()
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Mic Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          {/* Hint label */}
          {showHint && (
            <div className="absolute bottom-full left-0 mb-3 px-3 py-1.5 bg-hustle-dark text-white text-sm rounded-lg whitespace-nowrap shadow-md animate-fade-in">
              Ask me anything
              <span className="absolute top-full left-4 -mt-1 w-2 h-2 bg-hustle-dark rotate-45" />
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-hustle-blue to-[#2a6a8f] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-voice-pulse"
            aria-label={`Talk to ${businessName} AI receptionist`}
          >
            <MicIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Expanded Widget */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ maxHeight: '500px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-hustle-blue to-[#2a6a8f] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MicIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{businessName}</p>
                  <p className="text-blue-200 text-xs">AI Receptionist</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close voice receptionist"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px', maxHeight: '320px' }}>
              {conversationHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-hustle-blue text-white rounded-br-md'
                        : 'bg-gray-100 text-hustle-dark rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Current transcript while listening */}
              {isListening && currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-br-md bg-hustle-blue/60 text-white text-sm italic">
                    {currentTranscript}...
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-hustle-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-hustle-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-hustle-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Listening indicator */}
              {isListening && !currentTranscript && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-hustle-blue text-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hustle-blue opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-hustle-blue" />
                    </span>
                    Listening...
                  </div>
                </div>
              )}

              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-1 text-hustle-amber text-xs">
                    <SpeakerIcon className="w-3 h-3" />
                    Speaking...
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex justify-center">
                  <p className="text-red-500 text-xs text-center px-2">{error}</p>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? 'Listening...' : 'Type a message...'}
                  disabled={isProcessing || isListening}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-hustle-blue focus:ring-1 focus:ring-hustle-blue disabled:opacity-50 disabled:bg-gray-50"
                  aria-label="Type your message"
                />

                {/* Mic button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isProcessing}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isListening
                        ? 'bg-red-500 text-white animate-voice-pulse-sm'
                        : 'bg-gray-100 text-hustle-muted hover:bg-hustle-blue hover:text-white'
                    } disabled:opacity-50`}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <StopIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                  </button>
                )}

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing || isListening}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 disabled:hover:bg-hustle-blue flex-shrink-0"
                  aria-label="Send message"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-[10px] text-hustle-muted mt-2">Powered by MyHustle AI</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// --- SVG Icons ---

function MicIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ width: 'inherit', height: 'inherit', maxWidth: '24px', maxHeight: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
      <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ width: 'inherit', height: 'inherit', maxWidth: '24px', maxHeight: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ width: 'inherit', height: 'inherit', maxWidth: '24px', maxHeight: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  )
}

function StopIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" style={{ width: 'inherit', height: 'inherit', maxWidth: '24px', maxHeight: '24px' }}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

function SpeakerIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ width: 'inherit', height: 'inherit', maxWidth: '24px', maxHeight: '24px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  )
}
