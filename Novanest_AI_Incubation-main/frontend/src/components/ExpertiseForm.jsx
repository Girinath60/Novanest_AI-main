import React, { useState } from 'react';

const ExpertiseForm = ({ expertiseAreas = [], onSubmit, onClose }) => {
  const [formData, setFormData] = useState(expertiseAreas.join(', '));

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExpertiseAreas = formData.split(',').map(area => area.trim());
    onSubmit(updatedExpertiseAreas);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Update Expertise Areas</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Expertise Areas (comma separated)</label>
          <input
            type="text"
            value={formData}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900" // Added text-gray-900 for black text
            placeholder="e.g. Marketing, Finance, Technology"    // Added placeholder for better UX
            required
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpertiseForm;