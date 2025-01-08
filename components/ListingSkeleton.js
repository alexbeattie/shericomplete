// components/ListingSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ListingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height={200} />
      <div className="p-4">
        <Skeleton count={1} height={20} style={{ marginBottom: '10px' }} />
        <Skeleton count={1} height={20} width="50%" style={{ marginBottom: '10px' }} />
        <div className="flex justify-between">
          <Skeleton height={20} width="30%" />
          <Skeleton height={20} width="30%" />
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
