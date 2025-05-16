import React, { useState } from "react";

const Donations = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Donation successful!");
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-[80%] h-auto md:w-1/3">
        <h2 className="text-2xl font-bold text-center mb-6">Donate Now</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-50 mb-2" htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="w-full p-2 border border-gray-300 rounded dark:text-gray-800"
            >
              <option value="paypal">PayPal</option>
              <option value="creditCard">Credit Card</option>
              <option value="bankTransfer">Bank Transfer</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-50 mb-2" htmlFor="amount">Number</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              placeholder="Enter your credit number"
              className="w-full p-2 border border-gray-300 rounded dark:text-gray-800"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-50 mb-2" htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              placeholder="Enter donation amount"
              className="w-full p-2 border border-gray-300 rounded dark:text-gray-800"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#6D712E] text-white py-2 px-4 rounded-lg hover:bg-[#7D712E] w-full"
            >
              Confirm Donation
            </button>
          </div>
        </form>

        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Donations;
