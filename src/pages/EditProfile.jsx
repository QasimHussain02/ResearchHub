import React, { useState } from "react";

const EditProfile = ({ setShowEditPopup }) => {
  const [editInput, setEditInput] = useState({});
  const editInputChange = (e) => {
    let { name, value } = e.target;
    let input = { [name]: value };
    setEditInput((prev) => {
      return { ...prev, ...input };
    });
  };
  console.log(editInput);

  return (
    <div className="min-h-screen h-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => setShowEditPopup(false)}
            className="text-sm px-3 py-1 cursor-pointer bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Go back
          </button>
        </div>

        <form className="space-y-4">
          <input
            onChange={editInputChange}
            name="name"
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            onChange={editInputChange}
            name="headline"
            type="text"
            placeholder="Headline"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <textarea
            onChange={editInputChange}
            name="bio"
            placeholder="Bio"
            rows="3"
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <textarea
            onChange={editInputChange}
            name="about"
            placeholder="About"
            rows="4"
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
