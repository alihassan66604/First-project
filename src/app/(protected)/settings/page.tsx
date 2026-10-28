'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || '');
          setFullName(user.user_metadata?.full_name || '');
        }
      } catch {
        // Fallback in dev
      }
    }
    loadProfile();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setStatusMessage('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setErrorMessage('Failed to update password. Check Supabase connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile, password security, and display preferences.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          ✓ {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs font-medium text-red-800 dark:text-red-300">
          ✕ {errorMessage}
        </div>
      )}

      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
          <CardDescription>Your registered email and display name.</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <Input label="Email Address" value={email || 'demo@seopilot.app'} disabled />
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password & Security</CardTitle>
          <CardDescription>Update your login credentials securely.</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Session Management */}
      <Card className="border-red-200 dark:border-red-900/60">
        <CardHeader>
          <CardTitle className="text-base text-red-600 dark:text-red-400">Session & Logout</CardTitle>
          <CardDescription>End your current session across this device.</CardDescription>
        </CardHeader>
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-slate-500">
            Sign out of your SEO Pilot account safely.
          </p>
          <Button variant="destructive" size="sm" onClick={handleSignOut}>
            Sign Out Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
