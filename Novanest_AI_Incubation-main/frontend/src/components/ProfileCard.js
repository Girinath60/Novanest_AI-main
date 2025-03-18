import React from 'react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center">
        <img
          src={profile.profileDetails.profilePhoto}
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">{profile.profileDetails.bio}</p>
          <p className="text-gray-600">{profile.profileDetails.experience}</p>
        </div>
      </div>
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;