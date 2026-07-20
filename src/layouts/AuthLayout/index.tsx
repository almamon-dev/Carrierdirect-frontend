import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
}
