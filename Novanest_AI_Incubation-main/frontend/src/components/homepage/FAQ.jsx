import React from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqItems = [
    {
      id: 1,
      question: "How does the matching algorithm work?",
      answer: "Our proprietary AI analyzes multiple data points from your profile, including industry, skills, goals, and preferences. It then recommends the most compatible matches based on complementary expertise and alignment of objectives."
    },
    {
      id: 2,
      question: "Is Novanest free to use?",
      answer: "Novanest offers a freemium model. Basic matching and networking features are free for all users. Premium features like advanced analytics, priority matching, and unlimited connections are available with our subscription plans."
    },
    {
      id: 3,
      question: "How do you verify users?",
      answer: "We implement a thorough verification process for all users, including email verification, LinkedIn profile validation, and optional ID verification for investors. This ensures a high-quality network of genuine professionals."
    },
    {
      id: 4,
      question: "What kind of startups are on Novanest?",
      answer: "Novanest hosts startups from a wide range of industries, from early-stage to growth-phase. We have a particular focus on tech, healthcare, sustainability, fintech, and consumer goods, but welcome innovation in all sectors."
    }
  ];

  return (
    <section className="relative px-4 py-20 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Everything you need to know about Novanest
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {faqItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="text-blue-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {item.question}
              </h3>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/faq" className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center">
            View all FAQs
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;