import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { CiShoppingCart } from 'react-icons/ci';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const { getCartCount } = useContext(ShopContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collection', badge: 'New' }, // 👈 Added badge
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#D87D8F] focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="mx-auto md:mx-0">
              <img 
                src="./image/logo1.png" 
                alt="logo" 
                className="h-15 w-auto md:h-18 lg:h-20" 
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-grow md:space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  relative px-3 py-2 text-sm font-medium flex items-center
                  ${isActive ? 'text-[#D87D8F]' : 'text-gray-700 hover:text-[#D87D8F]'}
                `}
              >
                {link.name}

                {/* 👇 New glowing badge for Collections */}
                {link.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-[#D87D8F] rounded-full animate-pulse shadow-md">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Cart */}
          <div className="flex items-center">
            <NavLink 
              to="/cart" 
              className="group relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <CiShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-[#D87D8F]" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0 -right-0 w-5 h-5 bg-[#D87D8F] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm z-10">
                  {getCartCount()}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2 rounded-md text-base font-medium
                ${isActive ? 'bg-[#D87D8F]/10 text-[#D87D8F]' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {link.name}

              {/* 👇 Mobile badge */}
              {link.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-[#D87D8F] rounded-full animate-pulse shadow-md">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Cart in mobile */}
          <NavLink
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Cart
            {getCartCount() > 0 && (
              <span className="bg-[#D87D8F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
