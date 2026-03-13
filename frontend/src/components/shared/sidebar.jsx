import React from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { FcBullish } from 'react-icons/fc';
import { HiOutlineLogout, HiX } from 'react-icons/hi';

const linkClass =
  'flex items-center gap-2 font-light px-3 py-2 hover:bg-amber-500 hover:no-underline active:bg-amber-600 rounded-sm text-base text-white';

export default function Sidebar({ links = [], bottomLinks = [], onClose }) {
  return (
    <div className="bg-sky-600 w-60 h-full p-3 flex flex-col">
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between px-1 py-3">
          <div className="flex items-center gap-2">
            <FcBullish fontSize={24} />
            <span className="text-neutral-200 text-xl">CoreHours</span>
          </div>
          <HiX className="text-white text-2xl sm:hidden cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex flex-col gap-0.5 mt-6">
          {links.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-0.5 pt-4 mt-auto border-t border-neutral-700">
        {bottomLinks.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
        <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ link }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={link.path}
      className={classNames(
        pathname === link.path ? 'bg-amber-500' : '',
        linkClass
      )}
    >
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  );
}
