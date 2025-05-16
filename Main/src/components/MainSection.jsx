"use client"

import { useState, useRef, useEffect } from "react"
import { scroller } from "react-scroll"
import { Volume2, ArrowUp } from "lucide-react"
import "../common/main-section.css"
import AdoptFormModal from "../common/AdoptFormModal"

export default function MainSection() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const mainSectionHeight = document.querySelector(".main-section")?.offsetHeight || 500

      setShowScrollButton(scrollY > mainSectionHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToFAQ = () => {
    scroller.scrollTo("faqSection", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    })
  }

  const handleAdoptClick = () => {
    setAdoptFormOpen(true)
  }

  const speakText = () => {
    const textToSpeak =
      "Our adoptable cats and dogs are spayed/neutered and vaccinated thanks to our shelters. Since they've had a tough life before being rescued, we want to make sure they go to loving homes where they'll be safe and cared for."

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const [isAdoptFormOpen, setAdoptFormOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden main-section">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center animate-background"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#6D712E]/20 dark:bg-[#6D712E]/40 text-[#cdd18c] dark:text-[#B5B874] px-4 py-2 rounded-full text-base font-medium mx-auto">
            <span className="text-white">Find your perfect companion</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Adopt A Shelter <br />
            <span className="text-[#6D712E]">Cat or Dog</span>
          </h1>

          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Our adoptable cats and dogs are spayed/neutered and vaccinated thanks to our shelters. Since they've had a
              tough life before being rescued, we want to make sure they go to loving homes where they'll be safe and
              cared for.
              <button
                onClick={speakText}
                className="inline-flex ml-2 text-white/80 hover:text-white transition-colors"
                aria-label={isSpeaking ? "Stop speaking" : "Listen to text"}
              >
                <Volume2 className={`h-6 w-6 ${isSpeaking ? "text-[#6D712E]" : "text-white/80"}`} />
                <span className="sr-only">{isSpeaking ? "Stop speaking" : "Listen to text"}</span>
              </button>
            </p>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-center">
            <button
              onClick={handleAdoptClick}
              className="bg-[#6D712E] hover:bg-[#84893C] text-white h-14 px-10 rounded-lg text-xl font-medium transition-colors"
            >
              Adopt Now
            </button>

            <button
              onClick={scrollToFAQ}
              className="border-2 border-[#6D712E] text-[#9b9f5b] hover:bg-[#6D712E]/10 h-14 px-10 rounded-lg text-xl font-medium transition-colors"
            >
              View FAQs
            </button>
          </div> */}

          <div className="animate-bounce mt-16 text-white/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-sm mt-2">Scroll to learn more</p>
          </div>
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-5 bg-[#6D712E] hover:bg-[#84893C] text-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
