import React from 'react';

const Partners = () => {
  // Sample partner data - could be replaced with actual partner logos
  const partners = [
    { id: 1, name: "Partner 1" },
    { id: 2, name: "Partner 2" },
    { id: 3, name: "Partner 3" },
    { id: 4, name: "Partner 4" },
    { id: 5, name: "Partner 5" },
    { id: 6, name: "Partner 6" }
  ];

  return (
    <section className="relative px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Leading <span className="text-blue-400">Organizations</span>
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Join the global network of companies building the future together
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner) => (
            <div key={partner.id} className="flex items-center justify-center p-4">
              <div className="w-full h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-all duration-300 group">
                <span className="uppercase font-bold text-xl bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;