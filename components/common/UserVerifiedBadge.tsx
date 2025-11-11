import React from 'react';
import { User } from '../../types';
import { CheckmarkBadgeIcon } from '../Icons';

interface UserVerifiedBadgeProps {
    user: User;
}

const UserVerifiedBadge: React.FC<UserVerifiedBadgeProps> = ({ user }) => {
    if (user.businessStatus === 'verified') {
        return <CheckmarkBadgeIcon className="w-5 h-5 text-green-500" title="Verified Business" />;
    }
    if (user.agentStatus === 'verified') {
        return <CheckmarkBadgeIcon className="w-5 h-5 text-blue-500" title="Verified Agent" />;
    }
    // No badge for regular users or listers
    return null;
};

export default UserVerifiedBadge;
