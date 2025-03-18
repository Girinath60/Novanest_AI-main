import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    currentPosition: '',
    location: '',
    linkedin: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [profileSettings, setProfileSettings] = useState({
    visibility: true,
    emailNotifications: true,
    availabilityStatus: 'open'
  });
  
  const fileInputRef = useRef(null);

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.profileDetails?.bio || '',
        currentPosition: user.profileDetails?.currentPosition || '',
        location: user.profileDetails?.location || '',
        linkedin: user.profileDetails?.socialLinks?.linkedin || ''
      });
      
      setProfileSettings({
        visibility: user.profileSettings?.visibility !== false,
        emailNotifications: user.profileSettings?.emailNotifications !== false,
        availabilityStatus: user.profileSettings?.availabilityStatus || 'open'
      });
    }
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle expertise addition
  const handleAddExpertise = (expertise) => {
    if (!user.mentorshipAreas) {
      user.mentorshipAreas = [];
    }
    
    if (expertise && !user.mentorshipAreas.includes(expertise)) {
      const updatedAreas = [...user.mentorshipAreas, expertise];
      updateExpertise(updatedAreas);
    }
  };

  // Handle expertise removal
  const handleRemoveExpertise = (expertise) => {
    if (user.mentorshipAreas && user.mentorshipAreas.includes(expertise)) {
      const updatedAreas = user.mentorshipAreas.filter(area => area !== expertise);
      updateExpertise(updatedAreas);
    }
  };

  // Update expertise areas via API
  const updateExpertise = async (expertiseAreas) => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:5000/api/users/${user._id}/expertise`, 
        { expertiseAreas },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Update local state
      user.mentorshipAreas = expertiseAreas;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating expertise:', error);
      setSaveError('Failed to update expertise areas. Please try again.');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSaveError(null);
      
      // Create form data for profile update
      const formData = new FormData();
      formData.append('name', profileForm.name);
      
      // Add profile details
      const profileDetails = {
        bio: profileForm.bio,
        currentPosition: profileForm.currentPosition,
        location: profileForm.location,
        socialLinks: {
          linkedin: profileForm.linkedin
        }
      };
      
      formData.append('profileDetails', JSON.stringify(profileDetails));
      
      // Add photo if changed
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      
      // Send to the backend
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Update the user context with the new data
      if (response.data) {
        // If you have a method to update user context, use it here
        // updateUserContext(response.data);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle settings changes
  const updateProfileSettings = async (newSettings) => {
    try {
      setSaving(true);
      
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/settings`, 
        newSettings,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your mentor profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleProfileSubmit}>
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={user?.email}
                      disabled
                      className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm text-gray-800" // Added text-gray-800
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                    placeholder="Share your professional background, expertise, and mentorship philosophy..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">Brief bio that appears on your public profile</p>
                </div>
                
                <div className="mt-5 flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label htmlFor="currentPosition" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Position
                    </label>
                    <input
                      type="text"
                      id="currentPosition"
                      name="currentPosition"
                      value={profileForm.currentPosition}
                      onChange={handleProfileChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                      placeholder="e.g. CEO at TechVentures"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
                
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      value={profileForm.linkedin}
                      onChange={handleProfileChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 text-gray-800"
                      placeholder="yourprofile"
                    />
                  </div>
                </div>
                
                {saveSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                    Profile updated successfully!
                  </div>
                )}
                
                {saveError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {saveError}
                  </div>
                )}
                
                <div className="mt-5 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={saving}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium border-0 shadow-md"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Expertise Areas */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Areas of Expertise</h3>
              <div className="flex items-center">
                <input
                  type="text"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  placeholder="Add expertise..."
                  className="text-sm border-slate-200 rounded-md mr-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 shadow-sm"
                />
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (expertiseInput.trim()) {
                      handleAddExpertise(expertiseInput.trim());
                      setExpertiseInput('');
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                Select areas where you can provide the most value to entrepreneurs.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {user?.mentorshipAreas?.map((area, index) => (
                  <span key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 px-4 py-2 rounded-md text-sm flex items-center border border-slate-200 shadow-sm hover:shadow transition-all duration-200">
                    {area}
                    <button 
                      className="ml-2 text-slate-400 hover:text-red-500 focus:outline-none"
                      onClick={() => handleRemoveExpertise(area)}
                      title="Remove expertise"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
                {(!user?.mentorshipAreas || user.mentorshipAreas.length === 0) && (
                  <p className="text-gray-500 italic">No expertise areas added yet.</p>
                )}
              </div>
              
            </div>
          </div>
        </div>
        
        {/* Side Column */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Profile Photo</h3>
            </div>
            <div className="p-5 text-center">
              <div className="mb-5 flex justify-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                    <img
                      src={photoPreview || user?.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover border-2 border-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar-placeholder.png";
                      }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg hover:shadow-xl border-2 border-indigo-500 transition-all duration-300 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 group-hover:text-indigo-800 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Upload a professional photo</p>
              <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => fileInputRef.current.click()}
                className="mt-4"
              >
                Upload New Photo
              </Button>
              {profilePhoto && (
                <div className="mt-2">
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      try {
                        setSaving(true);
                        
                        // Create form data
                        const formData = new FormData();
                        formData.append('profilePhoto', profilePhoto);
                        
                        // Send to backend
                        await axios.put(
                          `http://localhost:5000/api/users/${user._id}`, 
                          formData,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                              'Content-Type': 'multipart/form-data',
                            },
                          }
                        );
                        
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      } catch (error) {
                        console.error('Error uploading photo:', error);
                        setSaveError('Failed to upload photo. Please try again.');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                  >
                    {saving ? 'Uploading...' : 'Save Photo'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                    <p className="text-xs text-gray-500">Allow entrepreneurs to find you</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button 
                      type="button" 
                      className={`${profileSettings.visibility ? 'bg-indigo-500' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
                      role="switch" 
                      aria-checked={profileSettings.visibility}
                      onClick={() => {
                        const newSettings = {
                          ...profileSettings,
                          visibility: !profileSettings.visibility
                        };
                        setProfileSettings(newSettings);
                        updateProfileSettings(newSettings);
                      }}
                    >
                      <span className="sr-only">Use setting</span>
                      <span 
                        aria-hidden="true" 
                        className={`${profileSettings.visibility ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-xs text-gray-500">Receive mentorship requests via email</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button 
                      type="button" 
                      className={`${profileSettings.emailNotifications ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      role="switch" 
                      aria-checked={profileSettings.emailNotifications}
                      onClick={() => {
                        const newSettings = {
                          ...profileSettings,
                          emailNotifications: !profileSettings.emailNotifications
                        };
                        setProfileSettings(newSettings);
                        updateProfileSettings(newSettings);
                      }}
                    >
                      <span className="sr-only">Use setting</span>
                      <span 
                        aria-hidden="true" 
                        className={`${profileSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Availability Status</h4>
                    <p className="text-xs text-gray-500">Set whether you're accepting new mentees</p>
                  </div>
                  <select 
                    className="block pl-3 pr-9 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-gray-800"
                    value={profileSettings.availabilityStatus}
                    onChange={(e) => {
                      const newSettings = {
                        ...profileSettings,
                        availabilityStatus: e.target.value
                      };
                      setProfileSettings(newSettings);
                      updateProfileSettings(newSettings);
                    }}
                  >
                    <option value="open">Open to New Mentees</option>
                    <option value="limited">Limited Availability</option>
                    <option value="closed">Not Accepting</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Preview Profile</h3>
            </div>
            <div className="p-5 text-center">
              <p className="text-sm text-gray-600 mb-4">See how your profile appears to entrepreneurs</p>
              <Button
                variant="outline"
                size="md"
                as={Link}
                to={`/mentor/${user?._id}`}
                target="_blank"
                className="border-slate-200 hover:border-slate-300 text-indigo-600 hover:text-indigo-800 hover:bg-slate-50"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              >
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;