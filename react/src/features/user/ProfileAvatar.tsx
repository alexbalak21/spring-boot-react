import { useRef, useState } from "react";
import { Avatar, Confirm } from "../../shared/components";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { UserInfo } from "./user.types";

interface ProfileAvatarProps { user: UserInfo | null; onImageSelected: (file: File) => void; onImageDeleted: () => void; }

export default function ProfileAvatar({ user, onImageSelected, onImageDeleted } : ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const selectUploadImage = () => {
        fileInputRef.current?.click();
    };

    const confirmDelete = () => {
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirm = () => {
        setShowConfirmDelete(false);
        onImageDeleted();
    };

    const handleDeleteCancel = () => {
        setShowConfirmDelete(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image");
            return;
        }

        // Delegate to parent
        onImageSelected(file);
    };

    return (
        <div className="flex justify-center mb-10">
            {user && (
                <div className="relative group">
                    <Avatar
                        name={user.name}
                        imageUrl={
                            user?.profileImage
                                ? `data:image/png;base64,${user.profileImage}`
                                : undefined
                        }
                        size={80}
                        bgColor="bg-gray-400"
                        textColor="text-white"
                    />

                    <button
                        onClick={selectUploadImage}
                        className="absolute inset-0 flex items-center justify-center 
                       bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
                       transition"
                    >
                        {user?.profileImage ? (
                            <PencilSquareIcon className="h-6 w-6 text-white transform" />
                        ) : (
                            <PlusIcon className="h-6 w-6 text-white" />
                        )}
                    </button>

                    {user?.profileImage && (
                        <button
                            onClick={confirmDelete}
                            className="absolute bottom-0 right-0 flex items-center justify-center 
                           bg-red-500/80 rounded-full p-1 opacity-0 group-hover:opacity-100 
                           transition"
                        >
                            <TrashIcon className="h-4 w-4 text-white" />
                        </button>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <Confirm open={showConfirmDelete} title="Delete Profile image" message="Do you want to delete your profile image ?" onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
        </div>
    );
}
