import { useMemo } from 'react';

export const useUserFiltering = (users, searchQuery, action) => {
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users.filter(user => user.role === 'user');

    // // Filter by action (status/activation)
    // if (action !== 'all') {
    //   filtered = filtered.filter(user => 
    //     user.is_active === action || user.status === action
    //   );
    // }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.active_plan >= searchQuery
      );
    }

    return filtered;
  }, [users, searchQuery, action]);

  return filteredUsers;
};