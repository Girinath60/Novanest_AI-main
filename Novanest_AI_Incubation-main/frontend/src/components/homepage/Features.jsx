import React from 'react';

const Features = () => {
  const featureCards = [
    {
      id: 1,
      title: "For Entrepreneurs",
      description: "Launch and scale your startup with tailored resources and connections",
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      benefits: [
        "Match with compatible investors",
        "Access experienced mentors",
        "Showcase your startup to the ecosystem"
      ]
    },
    {
      id: 2,
      title: "For Investors",
      description: "Discover promising startups and build a diverse investment portfolio",
      color: "purple",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      benefits: [
        "AI-matched startup recommendations",
        "Track startup performance metrics",
        "Connect with other investors & mentors"
      ]
    },
    {
      id: 3,
      title: "For Mentors",
      description: "Share your expertise and guide the next generation of entrepreneurs",
      color: "cyan",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      benefits: [
        "Discover compatible startups",
        "Schedule and manage sessions",
        "Build your professional network"
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        gradient: "from-blue-600 to-blue-400",
        bg: "bg-blue-100",
        text: "text-blue-600",
        checkmark: "text-blue-400"
      },
      purple: {
        gradient: "from-purple-600 to-purple-400",
        bg: "bg-purple-100",
        text: "text-purple-600",
        checkmark: "text-purple-400"
      },
      cyan: {
        gradient: "from-cyan-600 to-cyan-400",
        bg: "bg-cyan-100",
        text: "text-cyan-600",
        checkmark: "text-cyan-400"
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <section id="features" className="relative px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-blue-400">Novanest</span>
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Designed specifically for the startup ecosystem, our platform offers unique advantages for every user
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featureCards.map((feature) => {
            const colorClasses = getColorClasses(feature.color);
            
            return (
              <div 
                key={feature.id} 
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="p-1">
                  <div className={`bg-gradient-to-r ${colorClasses.gradient} p-6 rounded-t-lg`}>
                    <div className={`${colorClasses.bg} h-16 w-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className={`${colorClasses.text.replace('600', '100')}`}>{feature.description}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg 
                            className={`h-5 w-5 ${colorClasses.checkmark}`}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </div>
                        <p className="ml-2 text-gray-300">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
