// src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: user?.email || "",
    address: "",
    loyaltyPoints: 0,
    preferredTable: null,
    userName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api("/api/customers/me");
        if (data) {
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            contactNumber: data.contactNumber || "",
            email: data.email || user?.email || "",
            address: data.address || "",
            loyaltyPoints: data.loyaltyPoints || 0,
            preferredTable: data.preferredTable || null,
            userName: data.userName || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        // Profile might not exist yet, that's okay
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await api("/api/customers/me", {
        method: "PUT",
        body: profile,
      });
      setProfile(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "preferredTable" ? (value ? parseInt(value) : null) : value,
    }));
  };

  if (loading) {
    return (
      <div className="coffee-page flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="coffee-page min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="coffee-section-card p-8">
          <h2 className="text-3xl font-bold mb-2 text-gradient-amber text-center">
            My Profile
          </h2>
          <p className="text-sm text-amber-100/80 mb-8 text-center">
            Manage your account information and preferences
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-amber-200/80">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full p-3"
                  value={profile.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-amber-200/80">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full p-3"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-amber-200/80">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 opacity-60 cursor-not-allowed"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
              <p className="text-xs text-amber-100/60">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-amber-200/80">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                className="w-full p-3"
                value={profile.contactNumber}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-amber-200/80">
                Address
              </label>
              <textarea
                name="address"
                className="w-full p-3"
                rows="3"
                value={profile.address}
                onChange={handleChange}
                placeholder="Your delivery address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-amber-200/80">
                  Loyalty Points
                </label>
                <input
                  type="number"
                  name="loyaltyPoints"
                  className="w-full p-3 opacity-60 cursor-not-allowed"
                  value={profile.loyaltyPoints}
                  disabled
                />
                <p className="text-xs text-amber-100/60">Earned through orders</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-amber-200/80">
                  Preferred Table
                </label>
                <input
                  type="number"
                  name="preferredTable"
                  className="w-full p-3"
                  value={profile.preferredTable || ""}
                  onChange={handleChange}
                  placeholder="Table number"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] font-semibold py-3 rounded-xl hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] transition-all duration-300 shadow-md-amber hover:shadow-lg-amber disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

