import ChatWidget from './components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to Loops Integrated
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your Premier Digital Marketing & Creative Strategy Partner in Sri Lanka
            </p>
          </div>
          
          {/* Services Card - Centered and Enhanced */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our Services
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Digital Solutions - Centered */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 h-full">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">💻</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                      Digital Solutions
                    </h3>
                  </div>
                  <ul className="space-y-4 text-gray-700 text-lg">
                    <li className="flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Digital Marketing Strategy
                    </li>
                    <li className="flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Performance Marketing
                    </li>
                    <li className="flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Creative Content Creation
                    </li>
                    <li className="flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Brand Development
                    </li>
                  </ul>
                </div>
              </div>

              {/* Business Info - Centered */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-full">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">🏢</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                      Business Info
                    </h3>
                  </div>
                  <ul className="space-y-5 text-gray-700 text-lg">
                    <li className="flex items-center justify-center gap-4">
                      <span className="text-2xl">📍</span>
                      <span>Colombo 03, Sri Lanka</span>
                    </li>
                    <li className="flex items-center justify-center gap-4">
                      <span className="text-2xl">⏰</span>
                      <span>Mon-Fri: 9AM - 6PM</span>
                    </li>
                    <li className="flex items-center justify-center gap-4">
                      <span className="text-2xl">📧</span>
                      <span>hello@loops.lk</span>
                    </li>
                    <li className="flex items-center justify-center gap-4">
                      <span className="text-2xl">📞</span>
                      <span>+94 77 123 4567</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Chat assist. banner */}
          <div className="rounded-2xl p-8 text-white max-w-2xl mx-auto" style={{ backgroundColor: "#4f1769ff" }}>
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                Try Our Bilingual Chat Assistant!
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get instant answers in English or Sinhala about our services, pricing, and more!
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <span>Live Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  <span>Bilingual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  );
}