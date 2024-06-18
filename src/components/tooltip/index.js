import React, { useState, useRef } from "react";

const Tooltip = props => {
  const [hover, setHover] = useState(false);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setHover(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHover(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center font-mono">
      {hover && (
        <div className="absolute left-0 top-0 mx-auto flex w-full items-center justify-center gap-0 [z-index:999999] [transform:translateY(-8px)]">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="bg-quinary whitespace-nowrap text-[11px] text-white [font-weight:400] [letter-spacing:0] [line-height:13px]">
              {props.content}
            </div>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
};

export default Tooltip;
