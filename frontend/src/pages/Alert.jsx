import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const Alert = ({ lat, lng }) => {
  const [visible, setVisible] = useState(true);

  return (
    visible && (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        className="bg-[#facc15]/20 border-l-4 border-yellow-400 text-yellow-300 px-4 py-2 rounded relative flex justify-between items-center"
      >
        <div className="">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>Alert Triggered!</span>
          </div>
          <button onClick={() => setVisible(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </a>
    )
  );
};

export default Alert;
