import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const PrimaryButton = ({ children, className, ...props }) => {
    return (
        <button
            className={twMerge(
                clsx(
                    'bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-hover active:bg-primary-active transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                    className
                )
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
