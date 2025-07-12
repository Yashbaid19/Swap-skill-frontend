import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import {
  Search,
  Users,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Globe,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />

      {/* Hero Section with animated background */}
      <section className="relative py-32 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-skillswap-yellow/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200/30 rounded-full animate-bounce delay-75"></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-200/30 rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-skillswap-yellow/10 to-blue-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-skillswap-yellow/20 text-skillswap-black px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Join 10,000+ skill swappers worldwide
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight md:leading-tight">
              Unlock New{" "}
              <span className="bg-gradient-to-r from-skillswap-black to-gray-600 bg-clip-text text-transparent">
                Opportunities
              </span>
              <br className="block md:hidden" />
              <span className="block md:inline"> with </span>
              <span className="inline-block">
                <span className="bg-skillswap-yellow px-3 py-1 rounded-lg whitespace-nowrap">
                  SkillSwap
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with like-minded learners, share your expertise, and grow
              your skillset through meaningful skill exchanges
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/signup"
                className="group bg-skillswap-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/browse-skills"
                className="group bg-white text-skillswap-black border-2 border-skillswap-black px-8 py-4 rounded-xl hover:bg-skillswap-black hover:text-white transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Search className="w-5 h-5" />
                Explore Skills
              </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-skillswap-black mb-2">
                  500+
                </div>
                <div className="text-gray-600">Skills Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-skillswap-black mb-2">
                  10k+
                </div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-skillswap-black mb-2">
                  95%
                </div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillSwap?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most effective way to learn and teach skills in a
              collaborative community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Global Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with learners and experts from around the world. Share
                knowledge across cultures and time zones.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered system finds the perfect skill exchange partners
                based on your interests and availability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quality Assured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Verified profiles, rating system, and community feedback ensure
                high-quality learning experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-skillswap-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-sm">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Find Skills
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Search for the skills you want to learn from our extensive
                database of verified instructors.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-sm">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Connect & Swap
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Exchange your skills with others and start learning immediately
                through our secure platform.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-sm">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Grow & Succeed
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Apply your newly acquired skills and gain valuable experience
                while building lasting connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-skillswap-black to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of learners who are already growing their skills
            through meaningful exchanges
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-skillswap-yellow text-skillswap-black px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-skillswap-yellow py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold text-skillswap-black mb-2">
                SkillSwap
              </h3>
              <p className="text-skillswap-black/80">
                Connecting people through skill sharing
              </p>
            </div>

            <div className="flex flex-wrap gap-8 text-center md:text-left">
              <div>
                <h4 className="font-semibold text-skillswap-black mb-2">
                  Product
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/browse-skills"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Browse Skills
                  </Link>
                  <Link
                    to="/matches"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Find Matches
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-skillswap-black mb-2">
                  Support
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/contact"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    to="/help"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-skillswap-black mb-2">
                  Legal
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/privacy"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    className="block text-skillswap-black/80 hover:text-skillswap-black transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-skillswap-black/20 mt-8 pt-8 text-center">
            <p className="text-skillswap-black/60">
              © 2024 SkillSwap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
