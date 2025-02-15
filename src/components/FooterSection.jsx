import React from 'react';

const FooterSection = () => {
  return (
    <footer className="bg-[#6D712E] dark:bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">How Can We Help?</h3>
            <ul>
              <li><a href="#" className="hover:underline">Adopt a Pet</a></li>
              <li><a href="#" className="hover:underline">Adopt FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul>
              <li><a href="#" className="hover:underline">North Fairview, Quezon City</a></li>
              <li><a href="#" className="hover:underline">09667133695</a></li>
              <li><a href="mailto:Pawsitivity@gmail.com" className="hover:underline">Pawsitivity@gmail.com</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Keep In Touch With Us</h3>
            <p className='mb-3'>Join our Pawsitivity community and be first to hear about news of our lovable pets.</p>
            <form>
              <input type="email" placeholder="Email Address" className="border border-gray-300 p-2 w-full mb-4 text-black" />
              <button type="submit" className="bg-[#8D712E] hover:bg-[#9D712E] text-white font-bold py-2 px-4 rounded"
              onClick={() => alert("Subscription Success! Please wait for our email.")}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <p>&copy; Pawsitivity@2024</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;