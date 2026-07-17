import React from 'react';
import UserTableRow from './UserTableRow';
import { Users } from 'lucide-react';

const UserTable = ({ 
  users, 
  currentPage, 
  itemsPerPage,
  onHandleCash, 
  onHandleSession, 
  onHandleDelete 
}) => {
  const tableHeaders = [
    'S.No',
    'E-mail',
    'Wallet',
    'Package',
    'Account Status',
    'Package Status',
    'Direct Income',
    'ROI',
    'Created at',
    'Action'
  ];

  return (
    <div className="mt-4">
      {/* Desktop Table — hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto custom-scroll ">
        <div className="py-2">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th 
                    key={index}
                    className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((user, index) => (
                <UserTableRow
                  key={user.id || index}
                  user={user}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onHandleCash={onHandleCash}
                  onHandleSession={onHandleSession}
                  onHandleDelete={onHandleDelete}
                  variant="table"
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards — visible only on mobile */}
      <div className="lg:hidden space-y-3">
        {users?.map((user, index) => (
          <UserTableRow
            key={user.id || index}
            user={user}
            index={index}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onHandleCash={onHandleCash}
            onHandleSession={onHandleSession}
            onHandleDelete={onHandleDelete}
            variant="card"
          />
        ))}
      </div>
    </div>
  );
};

export default UserTable;
