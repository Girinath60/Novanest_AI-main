import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ProfileEditForm = ({ user, onClose, onUpdate }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileDetails?.profilePhoto || null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.profileDetails?.bio || '',
      experience: user?.profileDetails?.experience || '',
      dateOfBirth: user?.profileDetails?.dateOfBirth || '',
      address: user?.profileDetails?.address || '',
      phone: user?.profileDetails?.phone || '',
      linkedin: user?.profileDetails?.linkedin || '',
      website: user?.profileDetails?.website || '',
      expertiseAreas: user?.expertiseAreas?.join(', ') || '',
      // Role-specific fields
      ...(user?.role === 'investor' ? {
        investmentFocus: user?.profileDetails?.investmentFocus || '',
        investmentRange: user?.profileDetails?.investmentRange || '',
        previousInvestments: user?.profileDetails?.previousInvestments || '',
      } : {}),
      ...(user?.role === 'mentor' ? {
        mentorshipAreas: user?.mentorshipAreas?.join(', ') || '',
        yearsOfExperience: user?.profileDetails?.yearsOfExperience || '',
      } : {}),
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        bio: user.profileDetails?.bio || '',
        experience: user.profileDetails?.experience || '',
        dateOfBirth: user.profileDetails?.dateOfBirth || '',
        address: user.profileDetails?.address || '',
        phone: user.profileDetails?.phone || '',
        linkedin: user.profileDetails?.linkedin || '',
        website: user.profileDetails?.website || '',
        expertiseAreas: user.expertiseAreas?.join(', ') || '',
        // Role-specific fields
        ...(user.role === 'investor' ? {
          investmentFocus: user.profileDetails?.investmentFocus || '',
          investmentRange: user.profileDetails?.investmentRange || '',
          previousInvestments: user.profileDetails?.previousInvestments || '',
        } : {}),
        ...(user.role === 'mentor' ? {
          mentorshipAreas: user.mentorshipAreas?.join(', ') || '',
          yearsOfExperience: user.profileDetails?.yearsOfExperience || '',
        } : {}),
      });
      setImagePreview(user.profileDetails?.profilePhoto);
    }
  }, [user, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processFormData = async (data) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      Object.keys(data).forEach(key => {
        if (key === 'expertiseAreas') {
          // Handle expertise areas as comma-separated string
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        formData.append('profilePhoto', profileImage);
      }
      
      // Add a timestamp to avoid caching issues
      formData.append('timestamp', new Date().getTime());
      
      // Log the token to make sure it's present
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Check and log the user ID before sending
      console.log("User ID being used:", user.id);

      // Get user ID from token instead of props
      const getTokenUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
      
          return JSON.parse(jsonPayload).id;
        } catch (e) {
          console.error("Error extracting user ID from token:", e);
          return null;
        }
      };
      
      // Get the authenticated user ID directly from token
      const tokenUserId = getTokenUserId();
      console.log("Token user ID:", tokenUserId, "Props user ID:", user.id);
      
      // Use token user ID instead of props user ID
      const response = await axios.put(
        `http://localhost:5000/api/users/${tokenUserId}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Call onUpdate callback with updated user data
      if (onUpdate) {
        onUpdate(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert(`Error updating profile: ${error.response?.data || error.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto overflow-y-auto max-h-[80vh]">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Your Profile</h3>
      
      <form onSubmit={handleSubmit(processFormData)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image Section */}
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden border-2 border-gray-300">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md mb-6">
              Change Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
          
          {/* Basic Information Section */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-900">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  className={`w-full p-2 border rounded-md text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Bio</label>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Tell us about yourself"
                {...register('bio')}
              ></textarea>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Professional Experience</label>
              <textarea
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Your work experience and background"
                {...register('experience')}
              ></textarea>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-900">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="+1 (123) 456-7890"
                  {...register('phone')}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  {...register('dateOfBirth')}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="Your address"
                  {...register('address')}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...register('linkedin')}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="https://yourwebsite.com"
                  {...register('website')}
                />
              </div>
            </div>
          </div>
          
          {/* Role-specific Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-900">Professional Details</h4>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Expertise Areas</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Enter your areas of expertise, separated by commas"
                {...register('expertiseAreas')}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">E.g., Marketing, Finance, Mobile Development, AI</p>
            </div>
            
            {/* Investor-specific fields */}
            {user?.role === 'investor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Investment Focus</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="What kind of startups do you typically invest in?"
                    {...register('investmentFocus')}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Investment Range</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="E.g., $10K - $100K"
                    {...register('investmentRange')}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Previous Investments</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="List some of your notable investments"
                    {...register('previousInvestments')}
                  ></textarea>
                </div>
              </div>
            )}
            
            {/* Mentor-specific fields */}
            {user?.role === 'mentor' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Mentorship Areas</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="Areas where you can provide mentorship, separated by commas"
                    {...register('mentorshipAreas')}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    {...register('yearsOfExperience')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Controls */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;