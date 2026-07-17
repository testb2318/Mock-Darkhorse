import React, { useState } from 'react';
import { User, Mail, Shield, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminProfile = () => {
  const admin = useSelector((state) => state.auth.admin);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: admin?.fullname || 'Super Admin',
    email: admin?.email || 'admin@example.com',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F5C518] to-[#D4AF37] bg-clip-text text-transparent">My Profile</h1>
            <p className="text-slate-400 mt-1">Manage your admin account details</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-black font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C518]/5 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center border-4 border-black">
                    <span className="text-5xl font-bold text-[#F5C518]">
                      {formData.fullname.charAt(0)}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-[#F5C518] rounded-full text-black hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  Administrator
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 w-full space-y-6">
              
              <div className="space-y-1">
                <label className="text-sm text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F5C518]" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#F5C518]/50 transition-colors"
                  />
                ) : (
                  <div className="text-lg font-medium">{formData.fullname}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#F5C518]" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#F5C518]/50 transition-colors"
                  />
                ) : (
                  <div className="text-lg font-medium">{formData.email}</div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
