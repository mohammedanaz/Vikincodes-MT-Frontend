import React from 'react'

export default function CircleSpinner() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
        </div>
    );
}
