import React from "react";
import { Layout, Text } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";

// Mock POAP data for visual purposes
const mockPOAPs = [
  {
    id: 1,
    name: "Stellar Community Meetup 2024",
    date: "2024-01-15",
    image: "🌟",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    name: "Blockchain Developer Workshop",
    date: "2024-02-20",
    image: "💻",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    name: "DeFi Summit",
    date: "2024-03-10",
    image: "🚀",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 4,
    name: "NFT Art Gallery Opening",
    date: "2024-04-05",
    image: "🎨",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 5,
    name: "Web3 Hackathon",
    date: "2024-05-12",
    image: "⚡",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 6,
    name: "Crypto Conference",
    date: "2024-06-18",
    image: "🎯",
    color: "from-yellow-400 to-orange-400",
  },
];

const Home: React.FC = () => {
  const { address } = useWallet();

  return (
    <Layout.Content className="min-h-screen">
      <Layout.Inset className="py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your POAP Collection
            </h1>
            <Text as="p" size="md" className="text-lg text-gray-600 max-w-2xl mx-auto">
              {address
                ? "View and manage your Proof of Attendance Protocol badges"
                : "Connect your wallet to view your POAP collection"}
            </Text>
          </div>

          {!address ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-purple-200">
              <div className="text-6xl mb-6">🔐</div>
              <Text as="h2" size="lg" className="text-2xl font-semibold text-gray-800 mb-4">
                Connect Your Wallet
              </Text>
              <Text as="p" size="md" className="text-gray-600 max-w-md mx-auto">
                Connect your Stellar wallet to view your POAP badges and claim new ones from events you've attended.
              </Text>
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{mockPOAPs.length}</div>
                  <div className="text-gray-600">Total POAPs</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2024</div>
                  <div className="text-gray-600">Events Attended</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-gray-600">Collection Complete</div>
                </div>
              </div>

              {/* POAP Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockPOAPs.map((poap) => (
                  <div
                    key={poap.id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    {/* POAP Badge Circle */}
                    <div className={`bg-gradient-to-br ${poap.color} p-8 flex items-center justify-center`}>
                      <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-inner">
                        <span className="text-6xl">{poap.image}</span>
                      </div>
                    </div>

                    {/* POAP Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{poap.name}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <span className="text-sm">📅 {new Date(poap.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                          Verified
                        </span>
                        <span className="text-xs text-gray-500">#{poap.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State Message */}
              <div className="mt-12 text-center">
                <Text as="p" size="md" className="text-gray-500">
                  Attend events and claim more POAPs to grow your collection!
                </Text>
              </div>
            </>
          )}
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Home;
