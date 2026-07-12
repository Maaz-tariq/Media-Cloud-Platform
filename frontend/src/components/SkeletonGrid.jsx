import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-pulse">
            {/* Image placeholder */}
            <div className="w-full h-32 bg-gray-200 rounded-2xl mb-4"></div>
            
            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
            
            {/* Meta placeholder */}
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
    );
};

export const SkeletonGrid = ({ count = 5 }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};