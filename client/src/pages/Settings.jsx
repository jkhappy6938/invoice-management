import { useState } from "react";

const Settings = () => {
  const [emailAlerts, setEmailAlerts] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage application preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-8">
          <SettingRow
            title="Email Notifications"
            description="Receive email updates for invoice approvals."
          >
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() =>
                setEmailAlerts(
                  !emailAlerts
                )
              }
            />
          </SettingRow>

          <SettingRow
            title="Dark Mode"
            description="Enable dark mode UI."
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(
                  !darkMode
                )
              }
            />
          </SettingRow>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({
  title,
  description,
  children,
}) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500">
        {description}
      </p>
    </div>

    {children}
  </div>
);

export default Settings;