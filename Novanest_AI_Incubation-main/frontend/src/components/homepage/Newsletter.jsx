import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        success: true,
        message: 'Thank you for subscribing to our newsletter!'
      });
      setEmail('');
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error subscribing to the newsletter. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold text-white mb-4">Stay Updated on Innovation</h2>
                <p className="text-blue-100">
                  Join our newsletter for the latest entrepreneurship trends, funding opportunities, and exclusive Novanest community insights.
                </p>
              </div>
              <div className="lg:col-span-2">
                {submitStatus.message && (
                  <div className={`p-3 mb-4 rounded-md ${submitStatus.success ? 'bg-green-600/30 text-green-100' : 'bg-red-600/30 text-red-100'}`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="sr-only">Email Address</label>
                    <div className="relative rounded-md">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                <p className="text-sm text-gray-300 mt-3">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;