import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { PencilSquareIcon, LightBulbIcon } from '@heroicons/react/24/outline'

const selectedClassName = `
  flex gap-1 py-2 px-2 bg-primary text-secondary rounded-md hover:opacity-75
`

const unselectedClassName = `
  flex gap-1 py-2 px-2 border border-primary bg-secondary text-primary rounded-md hover:opacity-75
`

const Navigation = () => {
  const location = useLocation();

  const showLinks = !location.pathname.includes('/shared/');

  return (
    <div className="app-logo flex gap-3 items-center">
      {/*<Link to="/"><img className="bee-icon" src="bee.svg" alt="muchidea icon"/></Link>*/}
      <Link className="py-2 pl-0 pr-2 text-4xl font-bold font-italic font-serif" to="/">Much Idea</Link>
      {showLinks && (
        <Fragment>
          <Link className={location.pathname === '/edit' ? selectedClassName : unselectedClassName} to="/edit">
            <PencilSquareIcon className="h-6 w-6"/>
            Edit
          </Link>
          <Link className={location.pathname === '/generate' ? selectedClassName : unselectedClassName} to="/generate">
            <LightBulbIcon className="h-6 w-6"/>
            Generate
          </Link>
        </Fragment>
      )}
    </div>
  )
}

export default Navigation;
