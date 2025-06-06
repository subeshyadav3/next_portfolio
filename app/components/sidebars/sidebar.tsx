"use client"

import type React from "react"
import { Github, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"

const Sidebar: React.FC = () => {
  return (
    <div className="fixed right-0 top-1/4 flex h-screen  w-[50px] flex-col  items-center justify-center ">
      <div className="flex flex-col items-center gap-6">
  
        <Link
          href="https://github.com/subeshyadav3"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:transform hover:scale-105 transition-transform duration-300 ease-in-out hover:translate-y-1 " 
        >
          <Github size={22}  color="#90A0D9" />
          <span className="sr-only">GitHub</span>
        </Link>

        <Link
          href="https://linkedin.com/subeshyadav3"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:transform hover:scale-105 transition-transform duration-300 ease-in-out hover:translate-y-1 " 
        >
          <Linkedin size={22} color="#90A0D9" />
          <span className="sr-only">LinkedIn</span>
        </Link>

        <Link
          href="https://www.facebook.com/subesh.yadav.54772/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:transform hover:scale-105 transition-transform duration-300 ease-in-out hover:translate-y-1 " 
        >
          <Facebook size={22} color="#90A0D9" />
          <span className="sr-only">Facebook</span>
        </Link>


        <div className="mt-6 h-[130px] w-[1px] bg-white"></div>
      </div>
    </div>
  )
}

export default Sidebar
