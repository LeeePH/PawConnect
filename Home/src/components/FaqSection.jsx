"use client"

import { useState } from "react"
import { Plus, Minus, HelpCircle, Search, Mail, Phone, MapPin, X, MessageSquare, Clock } from "lucide-react"

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showContactModal, setShowContactModal] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal)
  }

  const faqItems = [
    {
      question: "What are the requirements to adopt a pet?",
      answer:
        "Requirements typically include being at least 18 years old, providing valid identification, completing an application form, and sometimes a home visit. Specific requirements may vary depending on the shelter or rescue organization. We want to ensure our pets go to loving, responsible homes that can provide proper care.",
    },
    {
      question: "How much does it cost to adopt a pet?",
      answer:
        "Adoption fees vary depending on the animal, age, and shelter policies. Generally, fees range from $50 to $300 for dogs and $25 to $150 for cats. These fees typically cover vaccinations, microchipping, spay/neuter procedures, and other medical care the pet received while at the shelter.",
    },
    {
      question: "Can I adopt if I live in an apartment?",
      answer:
        "Yes! Many pets thrive in apartments. We consider each adoption on a case-by-case basis. Some factors we consider include your apartment's pet policy, the specific needs of the pet, your lifestyle, and your ability to provide adequate exercise and enrichment. Many shelters have pets that are well-suited for apartment living.",
    },
    {
      question: "How long does the adoption process take?",
      answer:
        "The adoption process typically takes 1-7 days from application to bringing your pet home. Some adoptions can be completed same-day, while others may require more time for processing applications, checking references, or conducting home visits. We strive to make the process as efficient as possible while ensuring the best match between pets and adopters.",
    },
    {
      question: "Do you offer post-adoption support?",
      answer:
        "We provide resources and guidance after adoption, including training tips, veterinary recommendations, and behavior advice. Our team is available to answer questions and help with the transition. We want both you and your new pet to succeed in your life together.",
    },
    {
      question: "Can I return a pet if the adoption doesn't work out?",
      answer:
        "Yes, we have a return policy if the adoption isn't a good fit. We ask that you contact us first to discuss any issues you're experiencing, as many problems can be resolved with proper support and resources. If returning is necessary, we request that you schedule an appointment and provide information about the pet's behavior and habits to help us find a more suitable home.",
    },
    {
      question: "Are the pets up-to-date on vaccinations?",
      answer:
        "Yes, all our adoptable pets receive age-appropriate vaccinations, deworming, and flea/tick prevention before adoption. We provide medical records detailing the treatments they've received and recommendations for future care. Your new pet's health is a top priority for us.",
    },
    {
      question: "Can I adopt if I have other pets at home?",
      answer:
        "Yes, but we recommend introducing pets carefully. We can provide guidance on proper introductions and may suggest a meet-and-greet with your current pets before finalizing the adoption. Some of our animals are specifically noted as being good with other pets, while others may do better as the only pet in the household.",
    },
  ]

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: '', message: '' })

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    }

    try {
      const response = await fetch('http://localhost:5000/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({ type: 'success', message: 'Message sent successfully!' })
        e.target.reset()
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Error sending message. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="FAQ" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6D712E]/10 mb-6">
              <HelpCircle className="h-8 w-8 text-[#6D712E]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white uppercase">
              Frequently Asked <span className="text-[#6D712E]">Questions</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Find answers to common questions about pet adoption
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800">
                  <button
                    className="flex justify-between items-center w-full px-6 py-5 text-left"
                    onClick={() => toggleQuestion(index)}
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white">{item.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      {activeIndex === index ? (
                        <Minus className="h-5 w-5 text-[#6D712E]" />
                      ) : (
                        <Plus className="h-5 w-5 text-[#6D712E]" />
                      )}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray-600 dark:text-gray-300">{item.answer}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No questions found matching "{searchQuery}". Try a different search term.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? We're here to help!</p>
          <button
            onClick={toggleContactModal}
            className="inline-flex items-center justify-center px-6 py-3 border bg-[#6D712E] border-[#6D712E] text-white hover:bg-[#53571f] rounded-lg transition-colors duration-300 font-medium"
          >
            Contact Us
          </button>
        </div>
      </div>

      {showContactModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeIn">
          <div className="relative p-6">

            <button
              onClick={toggleContactModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close Modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6D712E]/10 mb-4">
                <MessageSquare className="h-8 w-8 text-[#6D712E]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact PawConnect</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">We'd love to hear from you!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#6D712E]/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#6D712E]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">(555) 123-4567</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mon-Fri: 9am-5pm</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#6D712E]/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#6D712E]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">info@pawconnect.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#6D712E]/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#6D712E]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">123 Pet Avenue</p>
                    <p className="text-gray-600 dark:text-gray-300">Pawsville, CA 90210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#6D712E]/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#6D712E]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Hours</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Monday - Friday: 9am - 5pm</p>
                    <p className="text-gray-600 dark:text-gray-300">Saturday: 10am - 4pm</p>
                    <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-4">Send us a message</h4>
                {formStatus.message && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    formStatus.type === 'success' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {formStatus.message}
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6D712E] focus:border-[#6D712E] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#6D712E] hover:bg-[#7D812E] text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  )
}


export default FaqSection

