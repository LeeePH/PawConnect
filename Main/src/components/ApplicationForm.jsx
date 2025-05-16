import React from "react";

const ApplicationForm = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-beige-50 text-gray-800">
      <h1 className="text-2xl font-bold text-center mb-6">ADOPTION APPLICATION</h1>
      <p className="text-sm text-center mb-4">
        <span className="text-red-500">*</span> indicates required fields
      </p>
      
      <form className="space-y-6">
        <div>
          <h2 className="font-bold text-lg mb-4">APPLICANT'S INFO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="First"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last"
                className="mt-7 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Occupation</label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Company/Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="N/A if unemployed"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Social Media Profile
              </label>
              <input
                type="text"
                placeholder="Enter FB/Twitter/IG Link"
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex space-x-4">
            <label>
              <input type="radio" name="status" className="mr-2" /> Single
            </label>
            <label>
              <input type="radio" name="status" className="mr-2" /> Married
            </label>
            <label>
              <input type="radio" name="status" className="mr-2" /> Others
            </label>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4">QUESTIONNAIRE</h2>
          <label className="block text-sm font-medium mb-2">
            What are you looking to adopt? <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label>
              <input type="radio" name="adopt" className="mr-2" /> Cat
            </label>
            <label>
              <input type="radio" name="adopt" className="mr-2" /> Dog
            </label>
            <label>
              <input type="radio" name="adopt" className="mr-2" /> Both
            </label>
            <label>
              <input type="radio" name="adopt" className="mr-2" /> Not decided
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Describe your ideal pet
          </label>
          <textarea
            className="mt-1 block w-full border rounded-md p-2"
            rows="3"
            placeholder="Include sex, age, appearance, temperament, etc."
          ></textarea>
        </div>

        <div className="mx-auto flex text-center items-center justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={e => {alert("Submit Success! <3")}}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
