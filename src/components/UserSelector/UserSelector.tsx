import React, { useState } from 'react';
import { api } from '@/utils/api';
import { Dropdown } from 'primereact/dropdown';

interface UserSelectorProps {
  onUserSelect: (userId: number) => void;
  selectedUserId?: number;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onUserSelect, selectedUserId }) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(selectedUserId || null);
  const { data: users, isLoading } = api.users.getAllUsers.useQuery();

  const userOptions = users?.map(user => ({
    label: `${user.first_name} ${user.last_name} (${user.role} - ${user.school})`,
    value: user.id
  })) || [];

  const handleUserChange = (userId: number) => {
    setSelectedUser(userId);
    onUserSelect(userId);
    // Store in localStorage for persistence
    localStorage.setItem('demoUserId', userId.toString());
  };

  return (
    <div className="user-selector p-4">
      <h3>Demo as User:</h3>
      <Dropdown
        value={selectedUser}
        options={userOptions}
        onChange={(e) => handleUserChange(e.value as number)}
        placeholder="Select a user to demo as..."
        loading={isLoading}
        className="w-full"
      />
    </div>
  );
};

export default UserSelector;