import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (image) {
      // Save image to localStorage
      localStorage.setItem('uploadedImage', image);

      // Navigate to the next step or page
      navigate('/crop'); // Replace '/next-step' with the actual route
    } else {
      alert('Please select an image before proceeding.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      <h1 className="text-4xl font-bold text-white mb-4">Upload Your Image</h1>
      <p className="text-lg text-white mb-8 text-center">
        Select an image to upload by clicking on the button below. Once selected, you will see a preview of the image.
      </p>
      <div className="relative w-80 h-80 border-4 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-white border-4 border-dashed border-gray-400 text-gray-600 text-3xl">
            <span>+</span>
          </div>
        )}
      </div>
      <button
        onClick={handleNext}
        className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default UploadImage;
