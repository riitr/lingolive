import { Github, Instagram, Linkedin, Mail, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import M1 from "./../assets/home/lingolive.png";

const Footer = () => {

    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

    const toggleContactDialog = () => {
        setIsContactDialogOpen(!isContactDialogOpen);
    };

    return (
        <>
            <footer className="border-t border-gray-100 py-12 mt-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2" onClick={toggleContactDialog} style={{ cursor: 'pointer' }}>
                        <span className="font-mono font-semibold">Contact with </span>
                            <img
                                src={M1}
                                alt="Photo 2"
                                 className="h-5"
                            />
                           
                        </div>
                        {/* <div className="flex items-center space-x-6">
                            <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
                            <Link to="/conversations" className="text-gray-500 hover:text-indigo-600">Conversations</Link>
                            <Link to="/account" className="text-gray-500 hover:text-indigo-600">Account</Link>
                        </div> */}
                        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Built with ❤️ and lots of ☕️</p>
                    </div>
                </div>
            </footer>

            {/* ContactContactDialog */}
            {isContactDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={toggleContactDialog}
                            className="absolute top-4 right-4 bg-gray-300 text-white p-2 rounded-full hover:bg-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold mb-4 text-center">
                            Contact LingoLive
                        </h2>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Here are my secret links. Feel free to stalk... professionally, of
                            course. 😉
                        </p>
                        <div className="flex flex-col gap-4">
                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/in/rajatsehgal95iitr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <Linkedin className="w-6 h-6 text-indigo-600" />
                                https://www.linkedin.com/in/rajatsehgal95iitr
                            </a>
                            {/* Email */}
                            <a
                                href="mailto:rsehgal.iitr@gmail.com"
                                className="flex items-center gap-3 text-gray-600 hover:text-violet-600 transition-colors"
                            >
                                <Mail className="w-6 h-6 text-violet-600" />
                                rsehgal.iitr@gmail.com
                            </a>
                            {/* GitHub */}
                            <a
                                href="https://github.com/riitr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-600 hover:text-black-600 transition-colors"
                            >
                                <Github className="w-6 h-6 text-black-600" />
                                https://github.com/riitr
                            </a>
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/rajat_iitr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-600 hover:text-pink-600 transition-colors"
                            >
                                <Instagram className="w-6 h-6 text-pink-600" />
                                https://www.instagram.com/rajat_iitr
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;