import React from "react";
import HamburgerMenu from "../component/HamburgerMenu";

export default function layout({ children }) {
  return (
    <>
        <div className="h-lvh bg-gray-50 dark:bg-gray-900">
            <HamburgerMenu />
            { children }
        </div>
    </>)
}
