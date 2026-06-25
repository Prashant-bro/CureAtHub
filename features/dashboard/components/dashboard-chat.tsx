"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Sparkles,
  ArrowRight,
  Menu,
  Mic,
  MicOff,
  Globe,
  Check,
  Copy,
  Square,
  Loader2,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "ai"
  text: string
  timestamp: Date
}

const LOCALIZED_SUGGESTIONS: Record<string, string[]> = {
  "en-IN": [
    "How many days will it take to get my score down?",
    "What foods should I avoid?",
    "Can you create a meal plan for me?",
    "What exercises are best for me?",
    "How does stress affect diabetes?",
    "What is a healthy BMI range?",
  ],
  "hi-IN": [
    "मेरा स्कोर कम होने में कितने दिन लगेंगे?",
    "मुझे किन खाद्य पदार्थों से बचना चाहिए?",
    "क्या आप मेरे लिए एक भोजन योजना (meal plan) बना सकते हैं?",
    "मेरे लिए कौन से व्यायाम सबसे अच्छे हैं?",
    "तनाव मधुमेह को कैसे प्रभावित करता है?",
    "स्वस्थ बीएमआई (BMI) रेंज क्या है?",
  ]
}

const LOCALIZED_QUESTIONS: Record<string, string[]> = {
  "en-IN": [
    "Welcome to CureAtHub AI! I'm here to help assess your diabetes risk. Let me ask you a few quick questions. First, could you tell me your age?",
    "Thank you! And what is your gender? (Male/Female/Other)",
    "Could you help me with your current weight in kg?",
    "Great! And what is your height in cm?",
    "Do you know your blood pressure reading? (e.g., 120/80) If not, just type 'skip'.",
    "Have you had your cholesterol levels checked recently? If yes, what was the value? Otherwise type 'skip'.",
    "Do you know your fasting blood glucose level? (mg/dL) Type 'skip' if unsure.",
    "What about your HbA1c percentage? Type 'skip' if you don't know.",
    "Does anyone in your family have diabetes? (Parents, siblings, grandparents)",
    "How would you describe your physical activity level? (Sedentary / Lightly Active / Moderately Active / Very Active)",
    "What's your current diet type? (Vegetarian / Non-Vegetarian / Vegan / Mixed)",
    "Do you smoke? (Yes / No / Occasionally)",
    "Do you consume alcohol? (Yes / No / Occasionally)",
  ],
  "hi-IN": [
    "CureAtHub AI में आपका स्वागत है! मैं आपके मधुमेह (diabetes) के जोखिम का आकलन करने में मदद के लिए यहाँ हूँ। मुझे आपसे कुछ त्वरित प्रश्न पूछने दें। सबसे पहले, क्या आप मुझे अपनी उम्र बता सकते हैं?",
    "धन्यवाद! और आपका लिंग (gender) क्या है? (पुरुष/महिला/अन्य)",
    "क्या आप किलोग्राम (kg) में अपना वर्तमान वजन बता सकते हैं?",
    "बहुत बढ़िया! और सेंटीमीटर (cm) में आपकी ऊंचाई क्या है?",
    "क्या आप अपना रक्तचाप (blood pressure) जानते हैं? (जैसे, 120/80) यदि नहीं, तो बस 'skip' (छोड़ें) लिखें।",
    "क्या आपने हाल ही में अपने कोलेस्ट्रॉल के स्तर की जांच कराई है? यदि हाँ, तो मान क्या था? अन्यथा 'skip' लिखें।",
    "क्या आप अपना फास्टिंग ब्लड ग्लूकोज स्तर (mg/dL) जानते हैं? अनिश्चित होने पर 'skip' लिखें।",
    "आपके HbA1c प्रतिशत के बारे में क्या? यदि आप नहीं जानते हैं तो 'skip' लिखें।",
    "क्या आपके परिवार में किसी को मधुमेह है? (माता-पिता, भाई-बहन, दादा-दादी)",
    "आप अपनी शारीरिक गतिविधि के स्तर का वर्णन कैसे करेंगे? (गतिहीन / हल्के सक्रिय / मध्यम सक्रिय / बहुत सक्रिय)",
    "आपका वर्तमान आहार प्रकार क्या है? (शाकाहारी / मांसाहारी / वीगन (Vegan) / मिश्रित)",
    "क्या आप धूम्रपान (smoke) करते हैं? (हाँ / नहीं / कभी-कभी)",
    "क्या आप शराब का सेवन करते हैं? (हाँ / नहीं / कभी-कभी)",
  ]
}

const LOCALIZED_RESPONSES: Record<string, Record<string, string>> = {
  "en-IN": {
    "How many days will it take to get my score down?": "Based on similar profiles, most users see a 5-10 point improvement in their risk score within 30-60 days of following personalized lifestyle changes. Consistency with diet and exercise is key!",
    "What foods should I avoid?": "For diabetes prevention, try to limit: refined sugars & sweets, white bread & refined grains, sugary drinks & fruit juices, processed & fried foods, and excessive red meat. Focus on whole grains, leafy greens, and lean proteins instead!",
    "Can you create a meal plan for me?": "I'd love to help! Based on your profile, I recommend a balanced Indian diet plan:\n\nBreakfast: Moong dal cheela with veggies\nLunch: Brown rice, dal, sabzi, salad\nSnack: Handful of almonds + green tea\nDinner: Roti with paneer/chicken, raita\n\nWant me to customize this further?",
    "What exercises are best for me?": "Great question! Here's what I recommend:\n\n30 min brisk walking daily\nYoga (especially Surya Namaskar) - 3x/week\nLight strength training - 2x/week\nCycling or swimming - 2x/week\n\nStart slow and gradually increase intensity. Even 150 minutes of moderate activity per week makes a big difference!",
    "How does stress affect diabetes?": "Stress hormones like cortisol can significantly raise blood sugar levels. Chronic stress may lead to insulin resistance, poor sleep, and emotional eating. Try meditation, deep breathing, or even 10 minutes of quiet time daily to manage stress effectively.",
    "What is a healthy BMI range?": "A healthy BMI is typically between 18.5-24.9. For Asian populations, a BMI under 23 is considered optimal for diabetes prevention. Your BMI helps us calculate risk, but it's just one piece of the puzzle!"
  },
  "hi-IN": {
    "मेरा स्कोर कम होने में कितने दिन लगेंगे?": "समान प्रोफाइल के आधार पर, अधिकांश उपयोगकर्ता व्यक्तिगत जीवन शैली में बदलावों के बाद 30-60 दिनों के भीतर अपने जोखिम स्कोर में 5-10 अंकों का सुधार देखते हैं। आहार और व्यायाम में निरंतरता कुंजी है!",
    "मुझे किन खाद्य पदार्थों से बचना चाहिए?": "मधुमेह से बचाव के लिए, इन्हें सीमित करने का प्रयास करें: रिफाइंड चीनी और मिठाइयाँ, सफेद ब्रेड और रिफाइंड अनाज, मीठे पेय और फलों के रस, प्रसंस्कृत और तले हुए खाद्य पदार्थ, और अत्यधिक लाल मांस। इसके बजाय साबुत अनाज, हरी पत्तेदार सब्जियां और लीन प्रोटीन पर ध्यान दें!",
    "क्या आप मेरे लिए एक भोजन योजना (meal plan) बना सकते हैं?": "मुझे मदद करने में खुशी होगी! आपकी प्रोफ़ाइल के आधार पर, मैं एक संतुलित भारतीय आहार योजना की सिफारिश करता हूँ:\n\nनाश्ता: सब्जियों के साथ मूंग दाल चीला\nदोपहर का भोजन: ब्राउन राइस, दाल, सब्जी, सलाद\nनाश्ता: मुट्ठी भर बादाम + ग्रीन टी\nरात का खाना: रोटी के साथ पनीर/क्रेडिट, रायता\n\nक्या आप चाहते हैं कि मैं इसे और अनुकूलित करूँ?",
    "मेरे लिए कौन से व्यायाम सबसे अच्छे हैं?": "अच्छा सवाल है! यहाँ मैं क्या सलाह देता हूँ:\n\nरोजाना 30 मिनट तेज चलना\nयोग (विशेष रूप से सूर्य नमस्कार) - सप्ताह में 3 बार\nहल्का स्ट्रेंथ ट्रेनिंग - सप्ताह में 2 बार\nसाइकिल चलाना या तैरना - सप्ताह में 2 बार\n\nधीरे-धीरे शुरू करें और तीव्रता बढ़ाएं। सप्ताह में 150 मिनट की मध्यम गतिविधि भी बड़ा अंतर लाती है!",
    "तनाव मधुमेह को कैसे प्रभावित करता है?": "कोर्टिसोल जैसे तनाव हार्मोन रक्त शर्करा (blood sugar) के स्तर को काफी बढ़ा सकते हैं. पुराना तनाव इंसुलिन प्रतिरोध, खराब नींद और भावनात्मक रूप से खाने का कारण बन सकता है। तनाव को प्रभावी ढंग से प्रबंधित करने के लिए रोजाना ध्यान, गहरी सांस लेने या 10 मिनट शांत रहने की कोशिश करें।",
    "स्वस्त बीएमआई (BMI) रेंज क्या है?": "एक स्वस्थ बीएमआई आमतौर पर 18.5-24.9 के बीच होता है। एशियाई आबादी के लिए, मधुमेह की रोकथाम के लिए 23 से कम बीएमआई को इष्टतम माना जाता है। आपका बीएमआई हमें जोखिम की गणना करने में मदद करता है, लेकिन यह पहेली का सिर्फ एक टुकड़ा है!"
  }
}

const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  "en-IN": {
    placeholder: "Type your message...",
    listeningPlaceholder: "Listening... Speak now!",
    startBtn: "Start Health Assessment",
    title: "Your AI Health Assistant",
    description: "I'll ask you a few health questions to assess your diabetes risk and create a personalized plan.",
    orAsk: "Or ask a question",
    aiAnalyzing: "Thank you for sharing all that information! Based on your responses, I'm analyzing your risk profile. Your personalized health plan is being generated. Check your Profile section for your updated risk score! "
  },
  "hi-IN": {
    placeholder: "अपना संदेश लिखें...",
    listeningPlaceholder: "सुन रहा हूँ... अब बोलें!",
    startBtn: "स्वास्थ्य मूल्यांकन शुरू करें",
    title: "आपका एआई स्वास्थ्य सहायक",
    description: "मैं आपके मधुमेह के जोखिम का आकलन करने और एक व्यक्तिगत योजना बनाने के लिए कुछ स्वास्थ्य प्रश्न पूछूँगा।",
    orAsk: "या एक प्रश्न पूछें",
    aiAnalyzing: "वह सारी जानकारी साझा करने के लिए धन्यवाद! आपके उत्तरों के आधार पर, मैं आपके जोखिम प्रोफ़ाइल का विश्लेषण कर रहा हूँ। आपकी व्यक्तिगत स्वास्थ्य योजना तैयार की जा रही है। अपने अपडेटेड रिस्क स्कोर के लिए अपना प्रोफाइल सेक्शन देखें! "
  }
}

interface DashboardChatProps {
  onOpenSidebar?: () => void
}

export function DashboardChat({ onOpenSidebar }: DashboardChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsTyping(false)
    }
  }

  const getLoaderText = () => {
    if (isAssessmentMode) {
      const textsList: Record<string, string[]> = {
        "en-IN": [
          "CureAtHub AI is analyzing your details...",
          "CureAtHub AI is updating your age metrics...",
          "CureAtHub AI is processing your gender details...",
          "CureAtHub AI is recording your weight profile...",
          "CureAtHub AI is calculating your BMI...",
          "CureAtHub AI is analyzing blood pressure...",
          "CureAtHub AI is processing cholesterol levels...",
          "CureAtHub AI is analyzing fasting glucose...",
          "CureAtHub AI is analyzing HbA1c value...",
          "CureAtHub AI is evaluating family history...",
          "CureAtHub AI is recording activity levels...",
          "CureAtHub AI is evaluating diet details...",
          "CureAtHub AI is analyzing lifestyle details...",
          "CureAtHub AI is processing alcohol details..."
        ],
        "hi-IN": [
          "CureAtHub AI आपके विवरण का विश्लेषण कर रहा है...",
          "CureAtHub AI आपकी आयु का विवरण अपडेट कर रहा है...",
          "CureAtHub AI आपके लिंग का विवरण प्रोसेस कर रहा है...",
          "CureAtHub AI आपका वजन रिकॉर्ड कर रहा है...",
          "CureAtHub AI आपका बीएमआई (BMI) कैलकुलेट कर रहा है...",
          "CureAtHub AI आपके रक्तचाप का विश्लेषण कर रहा है...",
          "CureAtHub AI कोलेस्ट्रॉल के स्तर को प्रोसेस कर रहा है...",
          "CureAtHub AI फास्टिंग ग्लूकोज का विश्लेषण कर रहा है...",
          "CureAtHub AI HbA1c स्तर का विश्लेषण कर रहा है...",
          "CureAtHub AI पारिवारिक इतिहास का मूल्यांकन कर रहा है...",
          "CureAtHub AI शारीरिक गतिविधि को रिकॉर्ड कर रहा है...",
          "CureAtHub AI आहार के विवरण को रिकॉर्ड कर रहा है...",
          "CureAtHub AI धूम्रपान की आदतों का विश्लेषण कर रहा है...",
          "CureAtHub AI शराब के सेवन के विवरण को प्रोसेस कर रहा है..."
        ]
      }
      const list = textsList[selectedLang] || textsList["en-IN"]
      return list[questionIndex - 1] || "CureAtHub AI is processing your clinical answers..."
    }
    return selectedLang === "hi-IN" 
      ? "CureAtHub AI आपके लिए व्यक्तिगत स्वास्थ्य सलाह तैयार कर रहा है..." 
      : "CureAtHub AI is formulating your personalized guidance..."
  }
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [isAssessmentMode, setIsAssessmentMode] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isListening, setIsListening] = useState(false)
  const [selectedLang, setSelectedLang] = useState("en-IN")
  const [showLangMenu, setShowLangMenu] = useState(false)
  const recognitionRef = useRef<any>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const TRANSCRIPTION_LANGUAGES = [
    { code: "en-IN", name: "English (India)" },
    { code: "hi-IN", name: "Hindi (हिंदी)" },
    { code: "ta-IN", name: "Tamil (தமிழ்)" },
    { code: "te-IN", name: "Telugu (తెలుగు)" },
    { code: "mr-IN", name: "Marathi (मराठी)" },
    { code: "bn-IN", name: "Bengali (বাংলা)" },
    { code: "kn-IN", name: "Kannada (ಕನ್ನಡ)" },
    { code: "gu-IN", name: "Gujarati (ગુજરાતી)" },
  ]

  const getTranslation = (key: string, lang: string) => {
    return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS["en-IN"]?.[key] || key
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
          inputRef.current?.focus()
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.lang = selectedLang
      recognitionRef.current.start()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const saveMessageToMongo = async (msg: Message) => {
    try {
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: msg.id,
          role: msg.role,
          text: msg.text,
          timestamp: msg.timestamp.toISOString(),
        }),
      })
    } catch (err) {
      console.error("Failed to save message to MongoDB:", err)
    }
  }

  useEffect(() => {
    async function loadChatHistory() {
      try {
        const res = await fetch("/api/chat/history")
        if (res.ok) {
          const data = await res.json()
          if (data && Array.isArray(data) && data.length > 0) {
            const seenIds = new Set<string>()
            const formatted = data.map((m: any, index: number) => {
              let msgId = m.id || `msg-${index}-${Date.now()}`
              if (seenIds.has(msgId)) {
                msgId = `${msgId}-${index}`
              }
              seenIds.add(msgId)
              return {
                id: msgId,
                role: m.role,
                text: m.text,
                timestamp: new Date(m.timestamp),
              }
            })
            setMessages(formatted)
            setConversationStarted(true)
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err)
      } finally {
        setIsLoadingHistory(false)
      }
    }
    loadChatHistory()
  }, [])


  const startConversation = (startAssessment = true) => {
    setConversationStarted(true)
    if (startAssessment) {
      setIsAssessmentMode(true)
      setAnswers([])
      setIsTyping(true)
      setTimeout(() => {
        const questionsList = LOCALIZED_QUESTIONS[selectedLang] || LOCALIZED_QUESTIONS["en-IN"]
        const welcomeMsg: Message = {
          id: `ai-welcome-${Date.now()}`,
          role: "ai",
          text: questionsList[0],
          timestamp: new Date(),
        }
        setMessages([welcomeMsg])
        saveMessageToMongo(welcomeMsg)
        setIsTyping(false)
        setQuestionIndex(1)
        inputRef.current?.focus()
      }, 800)
    } else {
      setIsAssessmentMode(false)
      setMessages([])
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const MAX_CHARS = 800
  const RATE_LIMIT_MAX = 8
  const RATE_LIMIT_WINDOW = 60000
  const rateBucketRef = useRef<number[]>([])

  const isRateLimited = (): boolean => {
    const now = Date.now()
    rateBucketRef.current = rateBucketRef.current.filter((t) => now - t < RATE_LIMIT_WINDOW)
    if (rateBucketRef.current.length >= RATE_LIMIT_MAX) return true
    rateBucketRef.current.push(now)
    return false
  }

  const BLOCKED_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<[^>]+>/g,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE|TRUNCATE|REPLACE)\b/gi,
    /[;&|`$(){}[\]\\]/g,
    /ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions?|prompts?|rules?)/gi,
    /forget\s+(all\s+)?(previous|prior|above|system)\s+(instructions?|prompts?|rules?)/gi,
    /you\s+are\s+now\s+(a|an|the)?\s+(?!cureathub)/gi,
    /act\s+as\s+(a|an|the)?\s+(?!health|diabetes|wellness|assistant)/gi,
    /pretend\s+(you\s+are|to\s+be)/gi,
    /new\s+(persona|role|identity|character)/gi,
    /switch\s+(to\s+)?((developer|god|admin|root|jailbreak)\s+)?mode/gi,
    /dan\s+mode|jailbreak\s+mode|developer\s+mode/gi,
    /disregard|override|bypass\s+(safety|filter|restrictions?|rules?)/gi,
    /reveal\s+(your\s+)?(system\s+prompt|instructions?)/gi,
    /\[SYSTEM\]|\[INST\]|\[END\]|<\|im_start\|>|<\|im_end\|>/gi,
    /\b(hack|exploit|malware|phishing|ddos|ransomware|sql\s*injection|xss|csrf|overflow|brute\s*force)\b/gi,
    /\b(bomb|weapon|gun|explosive|terror|terrorist|suicide|self[- ]harm)\b/gi,
    /\b(porn|sex|nude|naked|erotic|xxx)\b/gi,
  ]

  const ABUSE_WORDS = [
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
    "motherfucker", "whore", "slut", "nigger", "faggot", "retard",
    "madarchod", "behenchod", "chutiya", "randi", "gaand", "harami", "kamina",
  ]

  const sanitizeInput = (raw: string): { clean: string; blocked: boolean; reason?: string } => {
    if (raw.length > MAX_CHARS) return { clean: "", blocked: true, reason: "too_long" }
    const lower = raw.toLowerCase()
    for (const word of ABUSE_WORDS) {
      if (lower.includes(word)) return { clean: "", blocked: true, reason: "abuse" }
    }
    for (const pattern of BLOCKED_PATTERNS) {
      pattern.lastIndex = 0
      if (pattern.test(raw)) return { clean: "", blocked: true, reason: "pattern" }
    }
    const clean = raw.replace(/\s+/g, " ").trim()
    return { clean, blocked: false }
  }

  const handleSendMessage = async (text: string, forceNormalChat = false) => {
    if (!text.trim()) return

    if (isRateLimited()) {
      const rateLimitMsg: Message = {
        id: `ai-ratelimit-${Date.now()}`,
        role: "ai",
        text: "You're sending messages too quickly. Please wait a moment before sending another message.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, rateLimitMsg])
      return
    }

    const { clean, blocked, reason } = sanitizeInput(text)

    if (blocked) {
      const refusalTexts: Record<string, string> = {
        too_long: `Your message is too long (max ${MAX_CHARS} characters). Please shorten it.`,
        abuse: "I'm a health assistant and I'm here to help with diabetes prevention and wellness questions. I can't respond to harmful or abusive content.",
        pattern: "That request cannot be processed. Please ask me a health-related question about diabetes, nutrition, or wellness.",
      }
      const refusalMsg: Message = {
        id: `ai-blocked-${Date.now()}`,
        role: "ai",
        text: refusalTexts[reason ?? ""] ?? "I can only assist with health and wellness topics.",
        timestamp: new Date(),
      }
      setInput("")
      setMessages((prev) => [...prev, refusalMsg])
      return
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: clean,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    saveMessageToMongo(userMsg)
    setInput("")

    const controller = new AbortController()
    abortControllerRef.current = controller

    const checkAssessment = isAssessmentMode && !forceNormalChat

    if (checkAssessment) {
      setIsTyping(true)
      
      let riskProfile = null
      let dailyMetrics = null

      if (typeof window !== "undefined") {
        try {
          const savedReport = localStorage.getItem("mitig8_analyzed_report")
          if (savedReport) riskProfile = JSON.parse(savedReport)

          const water = Number(localStorage.getItem("mitig8_water_intake")) || 0
          const cals = Number(localStorage.getItem("mitig8_calories")) || 0
          const act = Number(localStorage.getItem("mitig8_activity")) || 0

          dailyMetrics = {
            waterIntake: water,
            caloriesConsumed: cals,
            exerciseMinutes: act
          }
        } catch (e) {
          // silent catch
        }
      }

      const historyForApi = messages.slice(-10).map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }))

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            message: clean,
            language: selectedLang,
            conversationHistory: historyForApi,
            riskProfile,
            dailyMetrics,
            isAssessmentMode: true,
            questionIndex: questionIndex,
            answers: answers,
          }),
        })

        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        const replyText = data.reply || "I'm having trouble responding right now. Please try again."
        const assessmentStatus = data.assessmentStatus || "answered"
        const extractedValue = data.extractedValue || clean

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: replyText,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
        saveMessageToMongo(aiMsg)

        if (assessmentStatus === "answered") {
          const updatedAnswers = [...answers, extractedValue]
          setAnswers(updatedAnswers)

          const questionsList = LOCALIZED_QUESTIONS[selectedLang] || LOCALIZED_QUESTIONS["en-IN"]

          if (questionIndex < questionsList.length) {
            setQuestionIndex((prev) => prev + 1)
          } else {
            // Compute and calculate risk score via LightGBM backend API
            try {
              const age = parseFloat(updatedAnswers[0]) || 30
              const gender = updatedAnswers[1]
              const weight = parseFloat(updatedAnswers[2]) || 70
              const height = parseFloat(updatedAnswers[3]) || 170
              const bmi = weight / ((height / 100) * (height / 100))
              const bp = updatedAnswers[4]
              const chol = parseFloat(updatedAnswers[5]) || 180
              const fbg = parseFloat(updatedAnswers[6]) || 90
              const hba1c = parseFloat(updatedAnswers[7]) || 5.2
              const family = updatedAnswers[8]
              const activity = updatedAnswers[9]
              const diet = updatedAnswers[10]
              const smoke = updatedAnswers[11]
              const alcohol = updatedAnswers[12]

              const predictRes = await fetch("/api/model/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  Age: age,
                  Gender: gender,
                  State: "Urban",
                  BMI: bmi,
                  Blood_Pre: bp,
                  Cholestero: chol,
                  Fasting_Bl: fbg,
                  Glucose_2: 120,
                  Serum_Ins: 15,
                  HbA1c_percent: hba1c,
                  Family_His: family,
                  Physical_A: activity,
                  Diet_Type: diet,
                  Smoking: smoke,
                  Alcohol: alcohol,
                  Weight_Lo: "No"
                })
              })

              if (!predictRes.ok) throw new Error("Predict request failed")
              const predictData = await predictRes.json()

              if (typeof window !== "undefined") {
                localStorage.setItem("mitig8_analyzed_report", JSON.stringify(predictData))
                window.dispatchEvent(new Event("mitig8_report_updated"))
              }

              const finalScoreMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "ai",
                text: `Thank you! Based on your responses, your computed Metabolic Diabetes Risk Score is **${predictData.riskScore}/100** (${predictData.riskClass}).\n\n${predictData.summary}\n\nYou can view your detailed recommendation analysis and personalized targets on the Home and Diet sections!`,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, finalScoreMsg])
              saveMessageToMongo(finalScoreMsg)
              setIsAssessmentMode(false)
            } catch (err) {
              console.error("Predict fetch error:", err)
              const fallbackScoreMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "ai",
                text: "Thank you for completing the assessment! Your health profile and risk parameters have been updated.",
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, fallbackScoreMsg])
              saveMessageToMongo(fallbackScoreMsg)
              setIsAssessmentMode(false)
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return
        console.error("Assessment fetch error:", err)
        const errorAssessmentMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: "I am having difficulty connecting to my AI core right now. Let's continue with the health assessment.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorAssessmentMsg])
        saveMessageToMongo(errorAssessmentMsg)
      } finally {
        setIsTyping(false)
      }
      return
    }

    setIsTyping(true)

    const historyForApi = messages.slice(-10).map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }))

    let riskProfile = null
    let dailyMetrics = null

    if (typeof window !== "undefined") {
      try {
        const savedReport = localStorage.getItem("mitig8_analyzed_report")
        if (savedReport) riskProfile = JSON.parse(savedReport)

        const water = Number(localStorage.getItem("mitig8_water_intake")) || 0
        const cals = Number(localStorage.getItem("mitig8_calories")) || 0
        const act = Number(localStorage.getItem("mitig8_activity")) || 0

        dailyMetrics = {
          waterIntake: water,
          caloriesConsumed: cals,
          exerciseMinutes: act
        }
      } catch (e) {
        // silent catch
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: clean,
          language: selectedLang,
          conversationHistory: historyForApi,
          riskProfile,
          dailyMetrics,
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()

      const replyText = data.reply || "मुझे अभी जवाब देने में कठिनाई हो रही है। कृपया पुनः प्रयास करें। / I'm having trouble responding right now. Please try again."

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: replyText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      saveMessageToMongo(aiMsg)
    } catch (err: any) {
      if (err.name === "AbortError") return
      const errorMsg: Message = { 
        id: `ai-${Date.now()}`, 
        role: "ai", 
        text: "I am having difficulty connecting to my AI core right now. However, I'm here to support you! Please continue logging your food and exercise so we can optimize your diabetes risk profile.", 
        timestamp: new Date() 
      }
      setMessages((prev) => [...prev, errorMsg])
      saveMessageToMongo(errorMsg)
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (isAssessmentMode) {
      setIsAssessmentMode(false)
    }
    handleSendMessage(suggestion, true)
  }

  const activeSuggestions = LOCALIZED_SUGGESTIONS[selectedLang] || LOCALIZED_SUGGESTIONS["en-IN"]

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex items-center justify-between h-14 px-4 border-b border-orange-100/30 bg-white/60 backdrop-blur-md shrink-0 z-30">
        <div className="flex items-center gap-2">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <span className="ml-1 text-sm font-black text-slate-700 uppercase tracking-wider">AI Chat</span>
        </div>

        <div className="relative" ref={langMenuRef}>
          <motion.button
            onClick={() => setShowLangMenu(!showLangMenu)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:text-orange-600 hover:border-orange-200 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>{TRANSCRIPTION_LANGUAGES.find((l) => l.code === selectedLang)?.name.split(" ")[0]}</span>
          </motion.button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-45 space-y-0.5"
              >
                <p className="text-[9px] font-bold text-slate-400 px-2.5 py-1.5 uppercase tracking-wider">
                  Select Language
                </p>
                <div className="max-h-56 overflow-y-auto scrollbar-thin">
                  {TRANSCRIPTION_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.code)
                        setShowLangMenu(false)
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        selectedLang === lang.code
                          ? "bg-orange-50 text-orange-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{lang.name}</span>
                      {selectedLang === lang.code && (
                        <Check className="w-3.5 h-3.5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white/60 backdrop-blur-xl flex flex-col">
        {isLoadingHistory ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500 animate-pulse">
              Restoring your chat history...
            </p>
          </div>
        ) : !conversationStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-9 h-9 text-orange-500" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl font-bold text-[#0F172A] mb-2"
            >
              {getTranslation("title", selectedLang)}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-slate-600 max-w-sm mb-8 leading-relaxed"
            >
              {getTranslation("description", selectedLang)}
            </motion.p>

            <motion.button
              onClick={() => startConversation(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(255,87,34,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {getTranslation("startBtn", selectedLang)}
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              <p className="w-full text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                {getTranslation("orAsk", selectedLang)}
              </p>
              {activeSuggestions.slice(0, 3).map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    startConversation(false)
                    setTimeout(() => handleSuggestionClick(chip), 200)
                  }}
                  className="text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md shadow-md shadow-orange-500/15"
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="flex items-center justify-between gap-4 mt-1.5">
                      <p
                        className={`text-[10px] ${
                          msg.role === "user" ? "text-white/50" : "text-slate-300"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {msg.role === "ai" && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-45 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                className="flex gap-3 items-start justify-start"
              >
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-md shadow-slate-100/50 flex items-center gap-3.5 bg-gradient-to-r from-white to-orange-50/20 relative overflow-hidden group">
                  <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200/50 flex items-center justify-center text-orange-500 shrink-0 shadow-sm border border-orange-200/20">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1.5 h-5 px-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full"
                        animate={{ 
                          y: [0, -5, 0],
                          scale: [1, 1.1, 1],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.16, 
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {conversationStarted && !isTyping && messages.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100/50">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {activeSuggestions.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSuggestionClick(chip)}
                  className="whitespace-nowrap text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversationStarted && (
          <div className="p-3 border-t border-slate-100/50 bg-white/40 relative">
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-10 left-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center justify-between shadow-lg z-30 animate-pulse"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span>Listening ({TRANSCRIPTION_LANGUAGES.find((l) => l.code === selectedLang)?.name})...</span>
                  </div>
                  <button
                    onClick={() => {
                      if (recognitionRef.current) recognitionRef.current.stop()
                    }}
                    className="underline text-[10px] uppercase font-black hover:text-orange-100"
                  >
                    Stop
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 relative">
              <div className="relative" ref={langMenuRef}>
                <motion.button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:border-orange-200 transition-all"
                  title="Change speech language"
                >
                  <Globe className="w-4.5 h-4.5" />
                  <span className="text-[10px] font-black absolute bottom-0.5 right-1 bg-slate-200 text-slate-600 px-1 rounded-sm uppercase scale-90">
                    {selectedLang.split("-")[0]}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-40 space-y-0.5"
                    >
                      <p className="text-[9px] font-bold text-slate-400 px-2.5 py-1.5 uppercase tracking-wider">
                        Speech Language
                      </p>
                      <div className="max-h-56 overflow-y-auto scrollbar-thin">
                        {TRANSCRIPTION_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLang(lang.code)
                              setShowLangMenu(false)
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                              selectedLang === lang.code
                                ? "bg-orange-50 text-orange-600"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span>{lang.name}</span>
                            {selectedLang === lang.code && (
                              <Check className="w-3.5 h-3.5 text-orange-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={toggleListening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200"
                }`}
                title="Speak to type"
              >
                {isListening ? (
                  <MicOff className="w-4.5 h-4.5" />
                ) : (
                  <Mic className="w-4.5 h-4.5" />
                )}
              </motion.button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, MAX_CHARS)
                    setInput(val)
                  }}
                  onPaste={(e) => {
                    e.preventDefault()
                    const pasted = e.clipboardData.getData("text/plain")
                    const stripped = pasted
                      .replace(/<[^>]+>/g, "")
                      .replace(/javascript:/gi, "")
                      .slice(0, MAX_CHARS)
                    setInput((prev) => (prev + stripped).slice(0, MAX_CHARS))
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(input)
                    }
                  }}
                  placeholder={
                    isListening
                      ? getTranslation("listeningPlaceholder", selectedLang)
                      : getTranslation("placeholder", selectedLang)
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400"
                  disabled={isTyping}
                />
                {input.length > MAX_CHARS * 0.75 && (
                  <span
                    className={`absolute right-3 bottom-2 text-[10px] font-semibold pointer-events-none ${
                      input.length >= MAX_CHARS ? "text-red-500" : "text-slate-400"
                    }`}
                  >
                    {input.length}/{MAX_CHARS}
                  </span>
                )}
              </div>

              {isTyping ? (
                <motion.button
                  onClick={handleStopResponse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/20 cursor-pointer"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 animate-pulse" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:shadow-none transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
