import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      number: "1",
      title: "Complete Your Profile",
      description: "Sign up and tell us about your startup, investment interests, or mentoring expertise.",
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      statusText: "AI analyzes your profile",
      progressType: "bar",
      progress: "75%"
    },
    {
      id: 2,
      number: "2",
      title: "Get Matched",
      description: "Our proprietary algorithm connects you with the perfect startups, investors, or mentors.",
      color: "indigo",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      ),
      statusText: "Matching in progress",
      progressType: "grid"
    },
    {
      id: 3,
      number: "3",
      title: "Connect & Grow",
      description: "Schedule meetings, exchange insights, and form lasting partnerships that drive success.",
      color: "purple",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      statusText: "Schedule sessions",
      progressType: "dots"
    }
  ];

  return (
    <section id="how-it-works" className="relative px-4 py-20 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How <span className="text-blue-400">Novanest</span> Works
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Our AI-powered platform creates connections that matter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div className={`md:absolute top-0 left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-${step.color}-600 w-12 h-12 rounded-full flex items-center justify-center mb-6 md:mb-0 mx-auto z-20`}>
                <span className="text-white font-bold">{step.number}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 mt-12">
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 mb-4">
                  {step.description}
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    {step.icon}
                    <p className={`text-sm text-${step.color}-200`}>{step.statusText}</p>
                  </div>
                  
                  {step.progressType === 'bar' && (
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div 
                        className={`h-2 bg-gradient-to-r from-${step.color}-400 to-${step.color}-600 rounded-full`} 
                        style={{ width: step.progress }}
                      ></div>
                    </div>
                  )}
                  
                  {step.progressType === 'grid' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`h-2 bg-gradient-to-r from-${step.color}-400 to-${step.color}-600 rounded-full`}></div>
                      <div className={`h-2 bg-gradient-to-r from-${step.color}-400 to-${step.color}-600 rounded-full`}></div>
                      <div className={`h-2 bg-gradient-to-r from-${step.color}-400 to-${step.color}-600 rounded-full`}></div>
                    </div>
                  )}
                  
                  {step.progressType === 'dots' && (
                    <div className="flex items-center justify-between">
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      <div className="w-1/3 h-0.5 bg-gray-700"></div>
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      <div className="w-1/3 h-0.5 bg-gray-700"></div>
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;