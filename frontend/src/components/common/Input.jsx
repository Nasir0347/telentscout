import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, id, error, className, ...props }) => {
    return (
        <div className='flex flex-col gap-1 w-full'>
            {label && (
                <label htmlFor={id} className='text-sm font-bold text-gray-700'>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={twMerge(
                    clsx(
                        'border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-500',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )
                )}
                {...props}
            />
            {error && <span className='text-sm text-red-600'>{error}</span>}
        </div>
    );
};

export default Input;
