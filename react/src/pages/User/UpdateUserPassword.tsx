// UpdateUserPassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../shared/components';
import { useAuth } from '../../features/auth';

export default function UpdateUserPassword() {
  const navigate = useNavigate();
  const { apiClient } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      setSuccess(true);
      // ✅ Redirect immediately after success
      navigate('/user');
    } catch (err: any) {
      setError(err?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6 min-w-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your current password and set a new one
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            Password updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter current password"
            autoComplete="current-password"
          />

          <Input
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <Input
            label="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />

          <div className="flex items-center justify-between space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>

  );
}
