"use client"

import type React from "react"
import '../../globals.css'

const SidebarLeft: React.FC = () => {
  return (
    <div className="fixed top-1/2 left-0 hidden  sm:flex h-screen w-[50px] flex-col items-center  pb-6 ">

      <a
        href="mailto:subeshgaming@gmail.com"
        className="rotate-90  text-sm tracking-widest hover:text-gray-300 gmail-btn"
      >
        subeshgaming@gmail.com
      </a>

    </div>
  )
}

export default SidebarLeft
