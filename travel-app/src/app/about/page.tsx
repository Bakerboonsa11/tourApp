'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-100 min-h-screen text-gray-800">
      
      {/* Ultra Styled Header */}
     

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[350px] mt-[100px]"
        style={{ backgroundImage: "url('/static/ethiopia-landscape.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
            Discover Ethiopia Like Never Before
          </h2>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold text-green-800 mb-4">About Ethio-Tours</h3>
        <p className="mb-6 leading-relaxed text-lg text-gray-700">
          Ethio-Tours is your trusted partner in exploring the breathtaking beauty,
          vibrant cultures, and ancient heritage of Ethiopia. From the lush highlands
          of Oromia to the rock-hewn churches of Lalibela, we design unforgettable
          journeys tailored to your interests.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">🌍 Diverse Destinations</h4>
            <p>Travel through Ethiopia’s regions and experience their unique traditions, food, and landscapes.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">🚌 Comfortable Travel</h4>
            <p>Enjoy modern vehicles, skilled drivers, and carefully chosen accommodations for your comfort.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition">
            <h4 className="text-green-700 font-bold mb-2">🤝 Local Guides</h4>
            <p>Explore with passionate guides who share authentic stories, history, and hidden gems.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/static/ethio2.avif"
            alt="Ethiopian Culture"
            className="rounded-2xl shadow-md w-full object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h3>
            <p className="mb-4 text-lg">
              Our mission is to connect travelers with the soul of Ethiopia.
              We promote sustainable tourism that benefits local communities
              while preserving Ethiopia’s natural and cultural treasures.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Eco-friendly travel options</li>
              <li>✅ Support for local artisans & businesses</li>
              <li>✅ Cultural exchange and respect</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-700 py-12 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Start Your Ethiopian Adventure Today</h3>
        <p className="mb-6">Book your next tour with Ethio-Tours and create memories that last a lifetime.</p>
        <Link
          href="/tours/all"
          className="bg-yellow-400 text-green-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
        >
          View Tours
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Ethio-Tours. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-yellow-300">Facebook</a>
            <a href="#" className="hover:text-yellow-300">Instagram</a>
            <a href="#" className="hover:text-yellow-300">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
