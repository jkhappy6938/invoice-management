import { Mail, Shield, User } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account information.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-4xl font-bold text-white">
            H
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Happy Patra
            </h2>

            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <Mail size={16} />
              happypatra@example.com
            </p>

            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <Shield size={16} />
              Administrator
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <InfoCard
            icon={<User size={22} />}
            title="Account Status"
            value="Active"
          />

          <InfoCard
            icon={<Shield size={22} />}
            title="Permission Level"
            value="Administrator"
          />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <div className="mb-3 text-emerald-600">
      {icon}
    </div>

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <h3 className="mt-1 text-lg font-semibold text-slate-900">
      {value}
    </h3>
  </div>
);

export default Profile;