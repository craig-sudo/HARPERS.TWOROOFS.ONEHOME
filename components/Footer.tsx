import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="my-8">
                 <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg" role="alert">
                    <div className="flex">
                        <div className="py-1">
                             <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-11a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1zm1-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
                        </div>
                        <div>
                            <p className="font-bold">Co-Parenting Tip</p>
                            <p className="text-sm">When proposing a schedule change, suggest a specific solution rather than just pointing out a problem. It shows you're willing to work together.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Harper's Home. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
