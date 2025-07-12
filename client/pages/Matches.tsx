import { useState } from "react";
import { Header } from "../components/Header";
import { Star, Users, Clock, MessageCircle, Heart, X } from "lucide-react";

interface Match {
  id: string;
  name: string;
  avatar: string;
  skillOffered: string;
  skillWanted: string;
  rating: number;
  completedSwaps: number;
  location: string;
  bio: string;
  matchScore: number;
  tags: string[];
  responseTime: string;
  availability: string;
}

const mockMatches: Match[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC",
    skillOffered: "React Development",
    skillWanted: "UI/UX Design",
    rating: 4.9,
    completedSwaps: 12,
    location: "San Francisco, CA",
    bio: "Frontend developer with 5+ years experience. Love building intuitive user interfaces and teaching others.",
    matchScore: 95,
    tags: ["React", "TypeScript", "Next.js"],
    responseTime: "Usually responds in 2 hours",
    availability: "Weekends preferred",
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "MR",
    skillOffered: "Digital Marketing",
    skillWanted: "Python Programming",
    rating: 4.7,
    completedSwaps: 8,
    location: "Austin, TX",
    bio: "Marketing strategist who wants to learn programming. Helped 20+ startups grow their user base.",
    matchScore: 88,
    tags: ["SEO", "Social Media", "Analytics"],
    responseTime: "Usually responds in 4 hours",
    availability: "Evenings and weekends",
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: "ET",
    skillOffered: "Graphic Design",
    skillWanted: "Photography",
    rating: 4.8,
    completedSwaps: 15,
    location: "New York, NY",
    bio: "Creative designer with expertise in branding and visual identity. Looking to expand into photography.",
    matchScore: 92,
    tags: ["Adobe Creative Suite", "Branding", "Typography"],
    responseTime: "Usually responds in 1 hour",
    availability: "Flexible schedule",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "DK",
    skillOffered: "Data Science",
    skillWanted: "Web Development",
    rating: 4.6,
    completedSwaps: 6,
    location: "Seattle, WA",
    bio: "Data scientist looking to transition into full-stack development. Expert in Python and machine learning.",
    matchScore: 85,
    tags: ["Python", "Machine Learning", "Statistics"],
    responseTime: "Usually responds in 6 hours",
    availability: "Weekends only",
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "LP",
    skillOffered: "Project Management",
    skillWanted: "Content Writing",
    rating: 4.9,
    completedSwaps: 20,
    location: "Chicago, IL",
    bio: "Experienced PM with Agile and Scrum expertise. Want to improve my content creation skills.",
    matchScore: 78,
    tags: ["Agile", "Scrum", "Leadership"],
    responseTime: "Usually responds in 3 hours",
    availability: "Evenings preferred",
  },
];

export default function Matches() {
  const [likedMatches, setLikedMatches] = useState<Set<string>>(new Set());
  const [passedMatches, setPassedMatches] = useState<Set<string>>(new Set());

  const handleLike = (matchId: string) => {
    setLikedMatches(new Set([...likedMatches, matchId]));
  };

  const handlePass = (matchId: string) => {
    setPassedMatches(new Set([...passedMatches, matchId]));
  };

  const visibleMatches = mockMatches.filter(
    (match) => !likedMatches.has(match.id) && !passedMatches.has(match.id),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skill Match Suggestions
          </h1>
          <p className="text-xl text-gray-600">
            Find perfect skill exchange partners based on your interests and
            goals
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-skillswap-black mb-2">
              {visibleMatches.length}
            </h3>
            <p className="text-gray-600">New Matches</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-skillswap-black mb-2">
              {likedMatches.size}
            </h3>
            <p className="text-gray-600">Liked Profiles</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-skillswap-black mb-2">
              {Math.floor(
                mockMatches.reduce((sum, match) => sum + match.matchScore, 0) /
                  mockMatches.length,
              )}
              %
            </h3>
            <p className="text-gray-600">Average Match Score</p>
          </div>
        </div>

        {/* Match Cards */}
        <div className="space-y-6">
          {visibleMatches.length > 0 ? (
            visibleMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-skillswap-yellow rounded-full flex items-center justify-center text-xl font-bold text-skillswap-black">
                        {match.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {match.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {match.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{match.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{match.completedSwaps} swaps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {match.matchScore}%
                      </div>
                      <p className="text-sm text-gray-500">Match Score</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Offers to teach:
                      </h4>
                      <p className="text-green-700">{match.skillOffered}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Wants to learn:
                      </h4>
                      <p className="text-blue-700">{match.skillWanted}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{match.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{match.responseTime}</span>
                    </div>
                    <span>{match.availability}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePass(match.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Pass
                    </button>
                    <button
                      onClick={() => handleLike(match.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-skillswap-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Interested
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-skillswap-yellow text-skillswap-black rounded-md hover:bg-yellow-400 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-skillswap-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-skillswap-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No more matches for now
              </h3>
              <p className="text-gray-600 mb-6">
                You've seen all available matches. Check back later for new
                suggestions!
              </p>
              <button
                onClick={() => {
                  setLikedMatches(new Set());
                  setPassedMatches(new Set());
                }}
                className="bg-skillswap-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Reset Matches
              </button>
            </div>
          )}
        </div>

        {/* Liked Matches Section */}
        {likedMatches.size > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Liked Matches
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMatches
                .filter((match) => likedMatches.has(match.id))
                .map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg p-4 shadow-sm border"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-sm font-bold text-skillswap-black">
                        {match.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {match.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {match.skillOffered}
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-skillswap-yellow text-skillswap-black py-2 rounded-md hover:bg-yellow-400 transition-colors text-sm">
                      Start Conversation
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
