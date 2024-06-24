import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PencilSquareIcon, LightBulbIcon } from '@heroicons/react/24/outline'

const selectedClassName = `
  flex gap-1 p-1 md:py-2 md:px-2 border-primary border-l-4 bg-tertiary font-bold text-secondary hover:opacity-75 text-sm md:text-lg
`

const unselectedClassName = `
  flex gap-1 p-1 md:py-2 md:px-2 border-tertiary border-l-4 bg-primary font-bold text-secondary hover:opacity-50 text-sm md:text-lg
`

const Navigation = () => {
  const location = useLocation();

  const showNav = !location.pathname.includes('/shared/');

  if (showNav) {
    return (
      <div className="flex mt-4 gap-3 items-center border-b-4 border-tertiary bg-transparent">
        <Link className="flex items-center justify-center py-2 pl-0 pr-2 text-lg md:text-6xl font-bold font-mono" to="/">
          muchidea<span className="text-quinary">.xyz</span>
        </Link>
        <Link className={location.pathname === '/edit' ? selectedClassName : unselectedClassName} to="/edit">
          <PencilSquareIcon className="h-6 w-6 hidden md:block"/>
          Edit
        </Link>
        <Link className={location.pathname === '/generate' ? selectedClassName : unselectedClassName} to="/generate">
          <LightBulbIcon className="h-6 w-6 hidden md:block"/>
          Generate
        </Link>
      </div>
    )
  }

  return '';
}

export default Navigation;
