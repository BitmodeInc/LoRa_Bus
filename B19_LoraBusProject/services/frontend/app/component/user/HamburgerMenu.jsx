"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ButtonThemeDropdown from "../theme/ButtonThemeDropdown"; // Add theme button back
import ReportModal from "./ReportModal";
const HamburgerMenu = () => {
  const router = useRouter(); // Only keep the router for bus
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleReport = () => {
    
    setShowModal(true)
    
  };

  return (
    <div className="fixed m-5 top-0 right-0 z-50">
      <div className="flex gap-5 text-black dark:text-white">
        {/* Theme Button */}
        <ButtonThemeDropdown /> 
        <button
          className="text-3xl"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      {isOpen ? (
        <div className="absolute right-0 border shadow-xl rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-60 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logoHam.png"
                alt="Logo"
                width={150}
                height={150}
                className="w-auto h-auto"
              />
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  onClick={handleReport}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faNewspaper} className="text-2xl mr-5" />
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HamburgerMenu;
