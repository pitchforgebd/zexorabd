import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { apiFetch, ApiError } from '../lib/api';
import { useAuth, type AdminUser } from './AuthContext';

export default function AdminAccount() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSavedMsg(null);

    const emailChanged = email.trim() !== '' && email.trim() !== user?.email;
    const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;

    if (!emailChanged && !wantsPasswordChange) {
      setError('Change the email and/or set a new password before saving.');
      return;
    }
    if (wantsPasswordChange && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (wantsPasswordChange && newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setSaving(true);
    try {
      const updated = await apiFetch<AdminUser>('/api/auth/account', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          email: emailChanged ? email.trim() : undefined,
          newPassword: wantsPasswordChange ? newPassword : undefined,
        }),
      });
      updateUser(updated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavedMsg('Saved. Your account has been updated.');
      setTimeout(() => setSavedMsg(null), 4000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update account');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">Account Settings</h1>
        <p className="text-body-text text-sm">Change the email or password used to sign in to this admin panel.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-gray-400" /> New Password (optional)
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Required to confirm any change"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {savedMsg && <span className="text-sm text-green-600 font-medium">{savedMsg}</span>}
        </div>
      </form>
    </div>
  );
}
