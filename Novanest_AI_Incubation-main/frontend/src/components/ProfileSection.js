import React from 'react';

const ProfileSection = ({ profile }) => {
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      <p>{profile.role}</p>
      <p>{profile.profileDetails.experience}</p>
      <p>{profile.profileDetails.bio}</p>
      <img src={profile.profileDetails.profilePhoto} alt="Profile" />
    </div>
  );
};

export default ProfileSection;