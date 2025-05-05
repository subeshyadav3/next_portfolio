import Image from "next/image"

export default function About() {
    return (
        <div className="flex flex-col sm:ml-[100px] min-h-screen lg:ml-[200px] sm:mt-[-200px] pb-5">
            <div>
                <h1 className="text-3xl  font-bold text-[#90A0D9] title-line">About Me</h1>
               
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="py-5 w-full md:w-1/2">
                    <p className="text-[#BDBDDD]   ">
                        I am a passionate engineering student with a keen interest in coding and problem-solving. I thrive on challenges and enjoy exploring new technologies to create innovative solutions for real-world problems. My dedication to continuous learning drives me to stay updated with the latest trends in the tech industry.
                    </p>
                    <p className="text-[#BDBDDD] py-5">
                        I am always eager to expand my skill set and take on new projects that push my boundaries. Whether it's developing web applications or diving into algorithms, I approach each task with enthusiasm and a commitment to excellence.
                    </p>
                    <p> I am working in these languages, library or Framework.</p>
                    <div className="flex pl-5">
                        <ul className="flex gap-2 mr-10 flex-col text-[#BDBDDD] pt-5 list-disc">

                            <li>JavaScript</li>
                            <li>React.js</li>
                            <li>Node.js</li>
                            <li>Next.js</li>
                            

                        </ul>

                        <ul className="flex gap-2 flex-col text-[#BDBDDD] pt-5 list-disc">
                            <li>Express.js</li>
                            <li>MongoDB</li>
                            <li>Tailwind CSS</li>
                            <li>Python</li>

                        </ul>
                    </div>
                </div>
                <div className="relative lg:ml-[100px] ml-5 my-5">

                    <div className="absolute  top-[30px] left-[40px] w-[220px] h-[230px] bg-[#272D44] border-1 border-[#BDBDDD] rounded-sm"></div>


                    <Image
                        src="/about.jpg"
                        alt="About Me"
                        width={250}
                        height={250}
                        className="relative  object-cover p-2 shadow-lg rounded-lg z-10 hover:top-[5px] hover:left-[5px] transition-transform duration-300 ease-in-out "
                    />
                </div>


            </div>
        </div>
    )
}