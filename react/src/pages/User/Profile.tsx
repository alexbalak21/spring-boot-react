import { useNavigate } from "react-router-dom";
import { Button, EditableText } from "../../shared/components";
import { ProfileAvatar } from "../../features/user";
import { useUser } from "../../features/user";
import { useAuth } from "../../features/auth";

interface UserDto {
  name?: string;
  email?: string;
}

export default function Profile() {
  const { apiClient } = useAuth();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Update name/email
  const updateUser = async (payload: UserDto) => {
    try {
      const response = await apiClient("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return response.json();
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update user");
    }
  };

  const handleSaveName = async (newName: string) => {
    if (user) {
      const updatedUser = await updateUser({ name: newName });
      setUser(updatedUser);
    }
  };

  const handleSaveEmail = async (newEmail: string) => {
    if (user) {
      const updatedUser = await updateUser({ email: newEmail });
      setUser(updatedUser);
    }
  };

  // ⬇️ NEW: Upload profile image (delegated from ProfileAvatar)
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient("/api/user/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      // Backend returns updated user with new profileImage
      const updatedUser = await response.json();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // ⬇️ NEW: Delete profile image (delegated from ProfileAvatar)
  const handleProfileImageDelete = async () => {
    try {
      const response = await apiClient("/api/user/profile-image", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Manually update user to remove profileImage
      if (user) {
        setUser({ ...user, profileImage: null });
      }
    } catch (err) {
      console.error("Image delete failed:", err);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/update-profile")}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Avatar with upload overlay */}
      <ProfileAvatar
        user={user}
        onImageSelected={handleProfileImageUpload}
        onImageDeleted={handleProfileImageDelete}
      />

      {!user && <p className="text-gray-600">Loading user info...</p>}

      {user && (
        <div className="space-y-3">
          <EditableText
            label="Name"
            value={user.name}
            onSave={handleSaveName}
          />

          <EditableText
            label="Email"
            value={user.email}
            onSave={handleSaveEmail}
          />

          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Role:</strong>
            <span className="text-gray-900">{user.roles.join(", ")}</span>
          </div>

          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Created:</strong>
            <span className="text-gray-900">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Updated:</strong>
            <span className="text-gray-900">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
