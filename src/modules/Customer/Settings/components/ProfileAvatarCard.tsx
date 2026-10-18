import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { ProfileState, getProfileInitials } from '../types/profileTypes';

interface ProfileAvatarCardProps {
  profile: ProfileState;
  previewUrl: string | null;
  isUploadingImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatarCard: React.FC<ProfileAvatarCardProps> = ({
  profile,
  previewUrl,
  isUploadingImage,
  onImageChange,
}) => {
  const activeAvatar = previewUrl || profile.profilePicture;

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
      <label className="relative shrink-0 group cursor-pointer block">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onImageChange}
          className="hidden"
        />
        {activeAvatar ? (
          <img
            src={activeAvatar}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200 group-hover:opacity-85 transition-opacity"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center text-lg font-bold shadow-sm group-hover:bg-slate-800 transition-colors">
            {getProfileInitials(profile.fullName)}
          </div>
        )}
        {isUploadingImage ? (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        ) : (
          <div
            title="Upload Profile Picture"
            className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 group-hover:text-[#ff4a1f] shadow-sm transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </div>
        )}
      </label>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 truncate">
          {profile.fullName || 'Your Name'}
        </h3>
        <p className="text-xs text-slate-500 truncate">{profile.email || 'your@email.com'}</p>
        <span
          className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${
            profile.isVerified
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {profile.isVerified ? 'Verified Customer' : 'Pending Verification'}
        </span>
      </div>
    </div>
  );
};

export default ProfileAvatarCard;
