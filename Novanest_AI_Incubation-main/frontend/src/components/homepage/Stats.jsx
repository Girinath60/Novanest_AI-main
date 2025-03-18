import React from 'react';

const Stats = () => {
  const statsData = [
    {
      value: "1200+",
      label: "Startups"
    },
    {
      value: "500+",
      label: "Investors"
    },
    {
      value: "300+",
      label: "Mentors"
    },
    {
      value: "$25M+",
      label: "Funds Raised"
    }
  ];

  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-transparent to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;