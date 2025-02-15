import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle} from '@fortawesome/free-solid-svg-icons'

const FaqSection = () => {
  return (
    <section className='max-w-4xl mx-auto py-16 px-4 text-center'>
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Question</h2>
        <div className="flex justify-center">
            <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md w-auto">
                <FontAwesomeIcon icon={faQuestionCircle} className='text-6xl text-green-700 mb-6'/>
                <h3 className="text-2xl font-semibold mb-4">FAQ's For Pet Adopters</h3>
                <p className="mb-6">
                    If you are thinking about adopting a pet, we know you'll have lots of things to consider.
                    Click here to see some of the most frequently asked questions.
                </p>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">View</button>
            </div>
        </div>
    </section>
  )
}

export default FaqSection