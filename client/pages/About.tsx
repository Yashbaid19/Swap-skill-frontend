import { Header } from "../components/Header";
import {
  Users,
  Target,
  Lightbulb,
  Heart,
  Rocket,
  Star,
  Brain,
  Globe,
  MessageSquare,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-skillswap-light-gray to-white">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-skillswap-yellow/20 text-skillswap-black px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Heart className="w-4 h-4" />
            Built with passion for learning
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-skillswap-black to-gray-600 bg-clip-text text-transparent">
              SkillSwap
            </span>{" "}
            — Connecting People through Skills
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're building a community where skills are shared, not sold.
            Whether it's graphic design, coding, public speaking, or yoga — if
            you can teach it, someone wants to learn it.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              🚀 Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We aim to democratize learning by enabling people to exchange
              skills directly with each other — without money or middlemen. We
              believe everyone has something valuable to offer.
            </p>
          </div>
        </div>
      </section>

      {/* Why SkillSwap */}
      <section className="py-20 px-4 bg-skillswap-light-gray">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              💡 Why SkillSwap?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Learn Real-World Skills
              </h3>
              <p className="text-gray-600 text-sm">
                Get practical knowledge from peers who use these skills every
                day
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Build Your Reputation
              </h3>
              <p className="text-gray-600 text-sm">
                Share what you know and grow your reputation in the community
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Meaningful Connections
              </h3>
              <p className="text-gray-600 text-sm">
                Build lasting relationships through collaborative learning
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Zero Cost Learning
              </h3>
              <p className="text-gray-600 text-sm">
                Just mutual learning and growth, no money involved
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start your skill exchange journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Create your profile
                  </h3>
                  <p className="text-gray-600">
                    Set up your account and showcase your skills and interests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    List your skills and interests
                  </h3>
                  <p className="text-gray-600">
                    Tell others what you can teach and what you want to learn
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Browse and send swap requests
                  </h3>
                  <p className="text-gray-600">
                    Find potential learning partners and send skill exchange
                    requests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-skillswap-black font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Connect and grow together
                  </h3>
                  <p className="text-gray-600">
                    Accept requests, start learning, and build meaningful
                    connections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-gradient-to-r from-skillswap-black to-gray-900 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-skillswap-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-skillswap-black" />
            </div>
            <h2 className="text-4xl font-bold mb-6">🌱 Our Story</h2>
            <p className="text-xl leading-relaxed opacity-90 mb-8">
              Born out of a college hackathon, SkillSwap started with a simple
              idea: What if people could trade skills instead of money?
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Today, we're growing into a full platform that encourages
              community learning across borders, connecting passionate learners
              and skilled teachers from all walks of life.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind SkillSwap
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-skillswap-yellow to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-skillswap-black">
                YB
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Yash Baid
              </h3>
              <p className="text-skillswap-black font-medium mb-3">
                Backend Developer & Visionary
              </p>
              <p className="text-gray-600 text-sm">
                Passionate about creating technology that brings people together
                and democratizes learning opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                TN
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Team Member
              </h3>
              <p className="text-skillswap-black font-medium mb-3">
                Frontend Designer & UI/UX
              </p>
              <p className="text-gray-600 text-sm">
                Focused on creating intuitive and beautiful user experiences
                that make skill sharing delightful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-20 px-4 bg-skillswap-light-gray">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              📈 What's Next?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Exciting features coming soon to enhance your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600 text-sm">
                Smart algorithms to find your perfect skill exchange partners
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Community Chatrooms
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with like-minded learners in topic-based discussions
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Verified Skill Badges
              </h3>
              <p className="text-gray-600 text-sm">
                Earn and showcase verified credentials for your expertise
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Global Events
              </h3>
              <p className="text-gray-600 text-sm">
                Monthly leaderboards and community learning events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-skillswap-black to-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of a growing community where skills are shared, connections
            are made, and everyone grows together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-skillswap-yellow text-skillswap-black px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/browse-skills"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-skillswap-black transition-all duration-300 font-medium text-lg"
            >
              Explore Skills
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
