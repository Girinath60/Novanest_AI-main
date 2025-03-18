import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const StartupForm = ({ onSubmit, onClose, initialData = null, isEditing = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fileUploads, setFileUploads] = useState({
    logo: null,
    pitchDeck: null,
    demoVideo: null,
  });
  const totalSteps = 4;
  
  const { 
    register, 
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: initialData || {
      // Basic Details
      startupName: '',
      tagline: '',
      website: '',
      location: '',
      
      // Business Description
      industry: '',
      problemStatement: '',
      solution: '',
      businessModel: '',
      stage: '',
      targetAudience: '',
      
      // Product & Traction
      developmentStage: 'Idea', // Default value
      businessModelType: '',
      currentCustomers: '',
      tractionMetrics: '',
      competitors: '',
      
      // Fundraising
      fundingGoal: '',
      useOfFunds: '',
      equityOffered: '',
      previousFunding: '',
      
      // Financial Performance
      revenueModel: '',
      currentRevenue: '',
      projectedGrowth: '',
      burnRate: '',
      breakEvenPoint: '',
      
      // Team
      founderBackground: '',
      teamMembers: '',
      mentorsAdvisors: '',
      
      // Market Research
      marketSize: '',
      customerValidation: '',
      goToMarketStrategy: '',
    }
  });
  
  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      reset(initialData);
    }
  }, [initialData, isEditing, reset]);
  
  
  const handleFileChange = (e, type) => {
    setFileUploads({
      ...fileUploads,
      [type]: e.target.files[0]
    });
  };
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const processFormData = (data) => {
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Add file uploads
    if (fileUploads.logo) formData.append('logo', fileUploads.logo);
    if (fileUploads.pitchDeck) formData.append('pitchDeck', fileUploads.pitchDeck);
    if (fileUploads.demoVideo) formData.append('demoVideo', fileUploads.demoVideo);
    
    // Send to parent component
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto overflow-y-auto max-h-[80vh]">
      <h3 className="text-2xl font-bold mb-4">
        {isEditing ? 'Update Your Startup' : 'Submit Your Startup'}
      </h3>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[...Array(totalSteps)].map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                ${currentStep > i ? 'bg-primary border-primary text-white' : 
                  currentStep === i + 1 ? 'border-primary text-primary' : 'border-gray-300 text-gray-300'}`}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > i + 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Basics</div>
          <div className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Business</div>
          <div className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Financials</div>
          <div className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Supporting</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(processFormData)}>
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4">Startup Overview</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Startup Name*</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.startupName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('startupName', { required: 'Startup name is required' })}
                />
                {errors.startupName && <p className="text-red-500 text-sm mt-1">{errors.startupName.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="A short description of your startup"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  {...register('tagline')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Website (if available)</label>
                <input
                  type="text"
                  placeholder="https://your-startup.com"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  {...register('website', {
                    pattern: {
                      value: /^(http:\/\/|https:\/\/)?[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i                     
                    }
                  })}
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Location*</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Startup Logo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 500x500px</p>
            </div>
            
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Business Description</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Industry Category*</label>
                <select
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('industry', { required: 'Industry is required' })}
                >
                  <option value="">Select Industry</option>
                  <option value="Tech">Tech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Ecommerce">E-commerce</option>
                  <option value="Food">Food & Beverage</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Energy">Energy</option>
                  <option value="Other">Other</option>
                </select>
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Stage*</label>
                <select
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.stage ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('stage', { required: 'Stage is required' })}
                >
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea</option>
                  <option value="MVP">MVP</option>
                  <option value="Scaling">Scaling</option>
                  <option value="Revenue">Revenue-Generating</option>
                </select>
                {errors.stage && <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Business Description & Traction */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Problem Statement*</label>
              <textarea
                placeholder="What problem is your startup solving?"
                rows={3}
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.problemStatement ? 'border-red-500' : 'border-gray-300'}`}
                {...register('problemStatement', { required: 'Problem statement is required' })}
              ></textarea>
              {errors.problemStatement && <p className="text-red-500 text-sm mt-1">{errors.problemStatement.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Solution Offered*</label>
              <textarea
                placeholder="How does your product/service solve this problem?"
                rows={3}
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.solution ? 'border-red-500' : 'border-gray-300'}`}
                {...register('solution', { required: 'Solution is required' })}
              ></textarea>
              {errors.solution && <p className="text-red-500 text-sm mt-1">{errors.solution.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Target Audience*</label>
              <textarea
                placeholder="Who are your potential customers/users?"
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.targetAudience ? 'border-red-500' : 'border-gray-300'}`}
                {...register('targetAudience', { required: 'Target audience is required' })}
              ></textarea>
              {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Business Model Type*</label>
                <select
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.businessModelType ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('businessModelType', { required: 'Business model type is required' })}
                >
                  <option value="">Select Business Model</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="D2C">D2C</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Other">Other</option>
                </select>
                {errors.businessModelType && <p className="text-red-500 text-sm mt-1">{errors.businessModelType.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Current Customers/Users</label>
                <input
                  type="text"
                  placeholder="Number of users, key clients, etc."
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  {...register('currentCustomers')}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Competitor Analysis</label>
              <textarea
                placeholder="List main competitors and how you're different"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('competitors')}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Business Description*</label>
              <textarea
                placeholder="A detailed description of your business"
                rows={4}
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.businessModel ? 'border-red-500' : 'border-gray-300'}`}
                {...register('businessModel', { required: 'Business description is required' })}
              ></textarea>
              {errors.businessModel && <p className="text-red-500 text-sm mt-1">{errors.businessModel.message}</p>}
            </div>
          </div>
        )}
        
        {/* Step 3: Financials */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4">Fundraising Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Funding Goal*</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="Amount in USD"
                    className={`flex-1 p-2 border rounded-r-md text-gray-900 ${errors.fundingGoal ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('fundingGoal', { 
                      required: 'Funding goal is required',
                      pattern: {
                        value: /^[0-9,]+$/,
                        message: 'Enter a valid amount'
                      }
                    })}
                  />
                </div>
                {errors.fundingGoal && <p className="text-red-500 text-sm mt-1">{errors.fundingGoal.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Equity Offered (%)</label>
                <input
                  type="text"
                  placeholder="Percentage of equity available"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  {...register('equityOffered', {
                    pattern: {
                      value: /^(\d{1,2}(\.\d{1,2})?|100)$/,
                      message: 'Enter a valid percentage (0-100)'
                    }
                  })}
                />
                {errors.equityOffered && <p className="text-red-500 text-sm mt-1">{errors.equityOffered.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Use of Funds*</label>
              <textarea
                placeholder="How will you use the investment? (e.g. Product Development, Marketing, Hiring)"
                rows={3}
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.useOfFunds ? 'border-red-500' : 'border-gray-300'}`}
                {...register('useOfFunds', { required: 'Use of funds is required' })}
              ></textarea>
              {errors.useOfFunds && <p className="text-red-500 text-sm mt-1">{errors.useOfFunds.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Previous Funding (if any)</label>
              <textarea
                placeholder="Amount raised, investors, valuation, etc."
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('previousFunding')}
              ></textarea>
            </div>
            
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Financial Performance</h4>
            
            <div>
              <label className="block text-gray-700 mb-1">Revenue Model</label>
              <textarea
                placeholder="How does your startup generate revenue?"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('revenueModel')}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Current Monthly Revenue (if any)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="Amount in USD"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md text-gray-900"
                    {...register('currentRevenue')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Monthly Burn Rate (if any)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    $
                  </span>
                  <input
                    type="text"
                    placeholder="Amount in USD"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md text-gray-900"
                    {...register('burnRate')}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Projected Growth</label>
              <textarea
                placeholder="Expected revenue in 6 months, 1 year, 3 years"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('projectedGrowth')}
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Step 4: Supporting Information */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4">Pitch & Media</h4>
            
            <div>
              <label className="block text-gray-700 mb-1">Pitch Deck*</label>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                className={`w-full p-2 border rounded-md ${!fileUploads.pitchDeck && errors.pitchDeck ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleFileChange(e, 'pitchDeck')}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Upload your investor presentation (PDF, PPT, or PPTX)</p>
              {!fileUploads.pitchDeck && errors.pitchDeck && <p className="text-red-500 text-sm mt-1">Pitch deck is required</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Product Demo Video (optional)</label>
              <input
                type="file"
                accept="video/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => handleFileChange(e, 'demoVideo')}
              />
              <p className="text-xs text-gray-500 mt-1">Upload a short video showcasing your product (max 100MB)</p>
            </div>
            
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Team & Market</h4>
            
            <div>
              <label className="block text-gray-700 mb-1">Founder Background*</label>
              <textarea
                placeholder="Your education & previous experience"
                rows={3}
                className={`w-full p-2 border rounded-md text-gray-900 ${errors.founderBackground ? 'border-red-500' : 'border-gray-300'}`}
                {...register('founderBackground', { required: 'Founder background is required' })}
              ></textarea>
              {errors.founderBackground && <p className="text-red-500 text-sm mt-1">{errors.founderBackground.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Team Members (if any)</label>
              <textarea
                placeholder="Key team members & their roles"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('teamMembers')}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Market Size</label>
              <textarea
                placeholder="Total Addressable Market (TAM) in $"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('marketSize')}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Go-To-Market Strategy</label>
              <textarea
                placeholder="How do you plan to acquire customers?"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                {...register('goToMarketStrategy')}
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button 
              type="button" 
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
            >
              Previous
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
            >
              Cancel
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md"
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StartupForm;