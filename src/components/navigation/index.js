import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PencilSquareIcon, LightBulbIcon } from '@heroicons/react/24/outline'

const selectedClassName = `
  flex gap-1 py-2 px-2 bg-black text-white rounded-md hover:opacity-75
`

const unselectedClassName = `
  flex gap-1 py-2 px-2 bg-slate-100 text-black rounded-md hover:opacity-75
`

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="app-logo flex gap-3">
      {/*<Link to="/"><img className="bee-icon" src="bee.svg" alt="muchidea icon"/></Link>*/}
      <Link className="py-2 pl-0" to="/">Much Idea</Link>
      <Link className={location.pathname === '/edit' ? selectedClassName : unselectedClassName} to="/edit">
        <PencilSquareIcon className="h-6 w-6"/>
        Edit
      </Link>
      <Link className={location.pathname === '/generate' ? selectedClassName : unselectedClassName} to="/generate">
        <LightBulbIcon className="h-6 w-6"/>
        Generate
      </Link>
    </div>
  )
}

export default Navigation;
