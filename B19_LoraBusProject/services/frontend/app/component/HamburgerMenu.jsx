"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBus,
  faSignHanging,
  faTriangleExclamation,
  faTowerBroadcast,
  faRightFromBracket,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ButtonThemeDropdown from "./theme/ButtonThemeDropdown";

const HamburgerMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleBus = () => {
    router.push('/admin/bus');
  };

  const handleUserReport = () => {
    router.push('/admin/userreport');
  };

  const handleBusStop = () => {
    router.push('/admin/busstop');
  };

  const handleLoRa = () => {
    router.push('/admin/LoRa');
  };

  const handleLogs = () => {
    router.push('/admin/adminlog');
  };

  const handleMap = () => {
    window.location.href = '/admin'
  };

  return (
    <div className="fixed m-5 top-0 right-0 z-50">
      <div className="flex gap-5 text-black dark:text-white">
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
                  onClick={handleBus}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBus} className="text-2xl mr-5" />
                  Bus
                </a>
              </li>
              <li>
                <a
                  onClick={handleBusStop}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignHanging} className="text-2xl mr-5" />
                  Bus Stop
                </a>
              </li>
              <li>
                <a
                  onClick={handleUserReport}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl mr-5" />
                  User Report
                </a>
              </li>
              <li>
                <a
                  onClick={handleLoRa}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTowerBroadcast} className="text-2xl mr-5" />
                  Lora
                </a>
              </li>
              <li>
                <a
                  onClick={handleLogs}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTowerBroadcast} className="text-2xl mr-5" />
                  Logs
                </a>
              </li>
              <li>
                <a
                  onClick={handleMap}
                  className="block py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faMap} className="text-2xl mr-5" /> 
                  Back to Map
                </a>
              </li>
              <li>
                {/* ตรวจสอบการยืนยันใน onClick */}
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                      window.location.href = "/logout";
                    }
                  }}
                  className="block w-full text-left py-2 px-5 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-2xl mr-5" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HamburgerMenu;
