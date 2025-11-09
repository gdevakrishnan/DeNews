import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import appContext from '../context/appContext';

const Navbar = () => {
    const { State, getStateParameters } = useContext(appContext);
    const { WalletAddress } = State;
    const location = useLocation();

    const links = [
        { "label": "Home", "to": "/read" },
        WalletAddress && { "label": "Write", "to": "/write" },
        { "label": "Docs", "to": "/docs" },
        WalletAddress && { "label": `${WalletAddress.slice(0, 7)}...${WalletAddress.slice(-5)}`, "to": "/profile" },
    ].filter(Boolean);

    return (
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <nav className="navbar fixed top-0 left-0 z-50 w-full bg-white/30 backdrop-blur-md shadow-lg">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 text-lg font-semibold text-gray-800">
                        <Link to={'/read'} className='text-2xl'><span className='text-primary'>De</span>News</Link>
                    </div>
                    <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal space-x-4 flex justify-center items-center">
                            {/* Navbar menu content */}
                            {
                                links.map(link => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className={`text-gray-800 hover:text-gray-600 ${location.pathname === link.to ? 'text-primary' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                !WalletAddress && <li>
                                    <button
                                        className="btn bg-primary text-white hover:bg-primary/80"
                                        onClick={() => getStateParameters()}
                                    >
                                        Connect Wallet
                                    </button>
                                </li>
                            }
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="drawer-side z-60">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-white backdrop-blur-md shadow-lg min-h-full w-80 p-4">
                    {/* Sidebar content */}
                    {
                        links.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`text-gray-800 hover:text-gray-600 ${location.pathname === link.to ? 'text-primary' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))
                    }
                    {
                        !WalletAddress && <li>
                            <button
                                className="btn mt-4 bg-primary text-white hover:bg-primary/80"
                                onClick={() => getStateParameters()}
                            >
                                Connect Wallet
                            </button>
                        </li>
                    }
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
