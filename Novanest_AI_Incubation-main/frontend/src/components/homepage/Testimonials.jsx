import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Founder, TechGrow",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Novanest connected me with the perfect mentor who helped scale my startup from concept to $3M in funding in just 8 months.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Angel Investor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "The AI matching on Novanest helped me discover promising startups that aligned perfectly with my investment thesis. I've already backed three companies through the platform.",
      rating: 5
    },
    {
      id: 3,
      name: "Aisha Johnson",
      role: "Mentor & Former CTO",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      content: "As someone who wants to give back to the startup ecosystem, Novanest makes it incredibly easy to connect with founders who can truly benefit from my experience.",
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="relative px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Success <span className="text-blue-400">Stories</span>
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Hear from entrepreneurs, investors, and mentors who found success with Novanest
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-1">
          <div className="relative rounded-xl overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`p-8 md:p-12 transition-all duration-500 ${index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3">
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden mx-auto border-2 border-white/10">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 flex items-center">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <svg className="h-8 w-8 text-blue-500 mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-200 text-xl mb-6 italic leading-relaxed">{testimonial.content}</p>
                    <div className="flex flex-col items-center md:items-start">
                      <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                      <p className="text-blue-300">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeTestimonial ? 'bg-blue-500 scale-125' : 'bg-gray-500'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;