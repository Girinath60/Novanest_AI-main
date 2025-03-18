import React from 'react';

const SuccessMetrics = () => {
  const metrics = [
    {
      id: 1,
      value: "3.2x",
      description: "Faster funding rounds for startups matched with the right investors",
      percentage: "76%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colorFrom: "blue",
      colorTo: "indigo"
    },
    {
      id: 2,
      value: "68%",
      description: "Higher success rate for startups with dedicated mentors",
      percentage: "84%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      colorFrom: "purple",
      colorTo: "pink"
    },
    {
      id: 3,
      value: "2.7M",
      description: "Professional connections made through our AI matching algorithm",
      percentage: "92%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      colorFrom: "cyan",
      colorTo: "teal"
    }
  ];

  return (
    <section className="relative px-4 py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Driving <span className="text-blue-400">Real Results</span>
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Our platform helps startups achieve significant growth milestones faster
          </p>
        </div>

        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div 
                key={metric.id} 
                className={`relative group ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-${metric.colorFrom}-600 to-${metric.colorTo}-600 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative z-10 hover:border-${metric.colorFrom}-500/50 transition-all duration-300 h-full flex flex-col`}>
                  <div className={`text-${metric.colorFrom}-400 mb-4`}>
                    {metric.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{metric.value}</h3>
                  <p className="text-gray-300 flex-grow">{metric.description}</p>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center">
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${metric.colorFrom}-500 to-${metric.colorTo}-500 rounded-full`} 
                          style={{ width: metric.percentage }}
                        ></div>
                      </div>
                      <span className={`text-${metric.colorFrom}-300 ml-3 font-medium`}>{metric.percentage}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;