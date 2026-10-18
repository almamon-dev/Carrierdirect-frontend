export interface ProfileState {
  fullName: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  companyName: string;
  designation: string;
  profilePicture: string | null;
  isVerified: boolean;
}

export const BLANK_PROFILE: ProfileState = {
  fullName: '',
  email: '',
  phone: '',
  secondaryPhone: '',
  companyName: '',
  designation: '',
  profilePicture: null,
  isVerified: false,
};

export function getProfileInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
