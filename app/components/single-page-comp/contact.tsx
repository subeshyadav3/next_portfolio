export default function ContactPage() {
    return (
        <div className=" min-h-screen flex justify-center items-center flex-col pl-2 sm:pl-0">
            {/* <h1 className="text-xl ">Contact Me</h1> */}
            <h2 className="text-4xl font-semibold mb-4 text-[#90A0D9]">Get In Touch</h2>
            <p className=" mb-8 w-full  sm:w-[500px] py-3">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's connect and make something amazing together!
            </p>


            <button className='border-2 border-[#90A0D9] px-4 py-2 rounded-sm resume-btn'
                onClick={() => window.location.href = "mailto:your-email@example.com"}>
                <span className='relative z-10 hover:text-blue-950'>Email</span>
            </button>
            
        </div>
    )
}
