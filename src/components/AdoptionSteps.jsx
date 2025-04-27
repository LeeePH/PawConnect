"use client"

import { useState, useEffect } from "react"
import { UserPlus, Search, FileText, Mail, ArrowRight } from "lucide-react"

const AdoptionSteps = () => {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === 3 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      title: "Create an Account",
      description: "Sign up and login to start your pet adoption journey",
      icon: <UserPlus className="h-8 w-8" />,
    },
    {
      title: "Find Your Match",
      description: "Search or use our algorithm to find your best suited pet companion",
      icon: <Search className="h-8 w-8" />,
    },
    {
      title: "Apply",
      description: "Fill up an application form with your details and preferences",
      icon: <FileText className="h-8 w-8" />,
    },
    {
      title: "Get Updates",
      description: "Wait for an email or notification about your application status",
      icon: <Mail className="h-8 w-8" />,
    },
  ]

  return (
    <section id="guide" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white uppercase">
            Adoption <span className="text-[#6D712E]">Process</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Follow these simple steps to bring your new furry friend home
          </p>
        </div>

        {/* Desktop Steps */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-4 gap-6 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    activeStep === index ? "scale-105 transition-transform duration-300" : ""
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                      activeStep === index
                        ? "bg-[#6D712E] text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-[#6D712E] border-2 border-[#6D712E] shadow-md"
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold ${
                      activeStep === index ? "bg-[#6D712E] shadow-md" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      activeStep === index ? "text-[#6D712E]" : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-center">{step.description}</p>

                  {index < 3 && (
                    <div className="hidden md:block absolute top-20 left-full -translate-x-1/2 transform">
                      <ArrowRight
                        className={`h-8 w-8 text-gray-300 dark:text-gray-700 ${
                          activeStep === index || activeStep === index + 1 ? "text-[#6D712E] dark:text-[#A3A86B]" : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="md:hidden">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 ${
                  activeStep === index ? "border-[#6D712E] shadow-lg" : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                      activeStep === index
                        ? "bg-[#6D712E] text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-[#6D712E] dark:text-gray-300"
                    }`}
                  >
                    <span className="font-bold text-lg">{index + 1}</span>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <span className="mr-3 text-[#6D712E]">{step.icon}</span>
                      <h3
                        className={`text-lg font-bold ${
                          activeStep === index ? "text-[#6D712E]" : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdoptionSteps

