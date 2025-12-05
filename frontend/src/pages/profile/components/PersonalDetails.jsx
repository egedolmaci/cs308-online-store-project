import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../../store/slices/userSlice";

const PersonalDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { isLoading } = user;

  // Parse address string from user state
  const parseAddress = (addressString) => {
    if (!addressString) {
      return { street: "", city: "", state: "", zip: "", country: "" };
    }
    // Split by spaces and extract parts
    const parts = addressString.trim().split(/\s+/);
    const country = parts.pop() || "";
    const zip = parts.pop() || "";
    const state = parts.pop() || "";
    const city = parts.pop() || "";
    const street = parts.join(" ") || "";

    return { street, city, state, zip, country };
  };

  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    ...parseAddress(user.address),
  });

  // Update form when user data changes
  useEffect(() => {
    setPersonalDetailsForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      ...parseAddress(user.address),
    });
  }, [user.firstName, user.lastName, user.email, user.address]);

  const handleSavePersonalDetails = async () => {
    try {
      const result = await dispatch(
        updateUserInfo({
          userId: user.id,
          userData: {
            first_name: personalDetailsForm.firstName,
            last_name: personalDetailsForm.lastName,
            address: (personalDetailsForm.street + " " +
              personalDetailsForm.city + " " +
              personalDetailsForm.state + " " + personalDetailsForm.zip + " " +
              personalDetailsForm.country),
          },
        })
      ).unwrap();

      console.log("Personal details updated successfully:", result);
      setEditingPersonalDetails(false);
    } catch (err) {
      console.error("Failed to update personal details:", err);
      alert(`Failed to update personal details: ${err}`);
    }
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

            {/* Address Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={personalDetailsForm.street}
                    onChange={(e) =>
                      setPersonalDetailsForm({
                        ...personalDetailsForm,
                        street: e.target.value,
                      })
                    }
                    placeholder="123 Fashion Avenue"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={personalDetailsForm.city}
                      onChange={(e) =>
                        setPersonalDetailsForm({
                          ...personalDetailsForm,
                          city: e.target.value,
                        })
                      }
                      placeholder="New York"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={personalDetailsForm.state}
                      onChange={(e) =>
                        setPersonalDetailsForm({
                          ...personalDetailsForm,
                          state: e.target.value,
                        })
                      }
                      placeholder="NY"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={personalDetailsForm.zip}
                      onChange={(e) =>
                        setPersonalDetailsForm({
                          ...personalDetailsForm,
                          zip: e.target.value,
                        })
                      }
                      placeholder="10001"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={personalDetailsForm.country}
                      onChange={(e) =>
                        setPersonalDetailsForm({
                          ...personalDetailsForm,
                          country: e.target.value,
                        })
                      }
                      placeholder="USA"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSavePersonalDetails}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditingPersonalDetails(false)}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Address Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-sand to-sage rounded-2xl flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Shipping Address
                  </h3>
                  {user.address ? (
                    <div className="space-y-1 text-sm text-gray-600 mt-2">
                      <p className="text-gray-900 font-semibold">
                        {user.address}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No address added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
