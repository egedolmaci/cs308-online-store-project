import { useState } from "react";

const PersonalDetails = ({ user }) => {
  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  const handleSavePersonalDetails = () => {
    // TODO: Implement actual API call
    console.log("Saving personal details:", personalDetailsForm);
    setEditingPersonalDetails(false);
    alert("Personal details updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        {!editingPersonalDetails && (
          <button
            onClick={() => setEditingPersonalDetails(true)}
            className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        {editingPersonalDetails ? (
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={personalDetailsForm.firstName}
                  onChange={(e) =>
                    setPersonalDetailsForm({
                      ...personalDetailsForm,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={personalDetailsForm.lastName}
                  onChange={(e) =>
                    setPersonalDetailsForm({
                      ...personalDetailsForm,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={personalDetailsForm.email}
                onChange={(e) =>
                  setPersonalDetailsForm({
                    ...personalDetailsForm,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={personalDetailsForm.phone}
                onChange={(e) =>
                  setPersonalDetailsForm({
                    ...personalDetailsForm,
                    phone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSavePersonalDetails}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingPersonalDetails(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.firstName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.lastName}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.phone}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Change Password
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Update your password to keep your account secure
        </p>
        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
