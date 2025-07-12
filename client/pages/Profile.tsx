import { Header } from "../components/Header";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Coming soon - showcase your skills and experience
          </p>
          <div className="bg-skillswap-light-gray rounded-lg p-12">
            <p className="text-gray-500">
              Profile content will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
