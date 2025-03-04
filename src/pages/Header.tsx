import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "./../assets/home/lingolive.png";
import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { User } from 'firebase/auth';


function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`px-4 py-2 rounded-lg transition-all ${isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
        >
            {children}
        </Link>
    );
}


const Header: React.FC<{ user:  User | null }> = ({ user }) => {


    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Parent Container */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0 h-auto md:h-16">
                        {/* Left Section */}
                        <div className="flex justify-between items-center">
                            <Link to="/">
                                <div
                                    className="flex items-center space-x-2"
                                    style={{ cursor: "pointer", padding: '18px' }}
                                >
                                    <img
                                        src={Logo}
                                        alt="Photo 2"
                                        className="h-7"
                                    />
                                </div>
                            </Link>

                            {/* Social Icons on Mobile */}
                            <div className="md:hidden flex items-center space-x-4">
                                <a
                                    href="https://www.linkedin.com/in/rajatsehgal95iitr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href="mailto:rsehgal.iitr@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-violet-600 transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://github.com/riitr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-black-600 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://www.instagram.com/rajat_iitr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-pink-600 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-6">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/conversations">Conversations</NavLink>
                            <NavLink to="/account">{user ?  <img src={user?.photoURL || "https://via.placeholder.com/150"} alt="User Profile" className="w-8 h-8 rounded-full mx-auto mb-4" />  : 'Account'}</NavLink>
                        </div>

                        {/* Social Icons on Desktop */}
                        <div className="hidden md:flex items-center space-x-6">
                            <a
                                href="https://www.linkedin.com/in/rajatsehgal95iitr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:rsehgal.iitr@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-violet-600 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/riitr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-black-600 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/rajat_iitr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-pink-600 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;