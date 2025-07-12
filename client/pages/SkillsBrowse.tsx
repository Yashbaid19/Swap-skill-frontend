import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Search, Filter, Star, Users, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

const mockSkills: Skill[] = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    category: "Programming",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. Perfect for beginners looking to start their web development journey.",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 234,
    duration: "8 weeks",
    level: "Beginner",
    tags: ["HTML", "CSS", "JavaScript", "Frontend"],
  },
  {
    id: "2",
    title: "Digital Marketing Strategy",
    category: "Marketing",
    description:
      "Master social media marketing, SEO, and content strategy to grow your online presence.",
    instructor: "Mike Chen",
    rating: 4.6,
    students: 156,
    duration: "6 weeks",
    level: "Intermediate",
    tags: ["SEO", "Social Media", "Content Marketing"],
  },
  {
    id: "3",
    title: "Graphic Design with Figma",
    category: "Design",
    description:
      "Create stunning designs using Figma. Learn design principles, prototyping, and collaboration.",
    instructor: "Emma Rodriguez",
    rating: 4.9,
    students: 189,
    duration: "5 weeks",
    level: "Beginner",
    tags: ["Figma", "UI/UX", "Design", "Prototyping"],
  },
  {
    id: "4",
    title: "Python Data Analysis",
    category: "Programming",
    description:
      "Analyze data using Python, pandas, and matplotlib. Build your data science foundation.",
    instructor: "David Kim",
    rating: 4.7,
    students: 267,
    duration: "10 weeks",
    level: "Intermediate",
    tags: ["Python", "Data Science", "Pandas", "Analytics"],
  },
  {
    id: "5",
    title: "Photography Basics",
    category: "Creative",
    description:
      "Master camera settings, composition, and lighting to take professional-quality photos.",
    instructor: "Lisa Thompson",
    rating: 4.5,
    students: 145,
    duration: "4 weeks",
    level: "Beginner",
    tags: ["Photography", "Composition", "Lighting"],
  },
  {
    id: "6",
    title: "Project Management",
    category: "Business",
    description:
      "Learn agile methodologies, team leadership, and project planning for successful delivery.",
    instructor: "Alex Morgan",
    rating: 4.8,
    students: 198,
    duration: "7 weeks",
    level: "Advanced",
    tags: ["Agile", "Leadership", "Planning", "Scrum"],
  },
];

const categories = [
  "All",
  "Programming",
  "Design",
  "Marketing",
  "Business",
  "Creative",
];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function SkillsBrowse() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const handleRequestSwap = () => {
    if (isAuthenticated) {
      navigate("/swap-request");
    } else {
      navigate("/signup");
    }
  };

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || skill.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Skills
          </h1>
          <p className="text-xl text-gray-600">
            Discover new skills and find the perfect learning opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills, topics, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredSkills.length}{" "}
            {filteredSkills.length === 1 ? "skill" : "skills"} found
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-skillswap-yellow text-skillswap-black rounded-full">
                    {skill.category}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {skill.level}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {skill.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {skill.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{skill.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{skill.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{skill.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">by {skill.instructor}</p>
                  <button
                    onClick={handleRequestSwap}
                    className="bg-skillswap-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
                  >
                    Request Swap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No skills found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="text-skillswap-black hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
