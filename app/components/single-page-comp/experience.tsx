import Image from 'next/image';
import useInViewAnimation from '@/app/hooks/useInViewAnimation';
import '../../globals.css';

const experienceData = [
  {
    logo: "/projects/upwork.png",
    logoAlt: "Freelance Fullstack Logo",
    position: "Freelance Fullstack Developer",
    currentlyWorkHere: false,
    startDate: new Date(2025, 0),
    endDate: null,
    summary: [
      "Built and maintained fullstack web applications using React, Node.js, and MongoDB.",
      "Collaborated with clients to gather requirements and deliver customized software solutions.",
      "Implemented responsive UI designs and RESTful APIs to improve user experience and performance.",
    ],
  },
  {
    logo: "/projects/c4n.png",
    logoAlt: "Code for Nepal Logo",
    position: "Data Science Fellow",
    currentlyWorkHere: true,
    startDate: new Date(2025, 4),
    endDate: null,
    summary: [
      "Participating in a fellowship focused on Python, data analysis, SQL, and machine learning.",
      "Working with tools like pandas, scikit-learn, and Jupyter Notebooks on hands-on projects.",
    ],
  },
  {
    logo: "/projects/blogger.png",
    logoAlt: "Blogger Logo",
    position: "Blogger – Education Content Creator",
    currentlyWorkHere: false,
    startDate: new Date(2018, 3),
    endDate: new Date(2023, 3),
    summary: [
      "Created academic blogs with optimized content tailored for students and lifelong learners.",
      "Utilized Google Keyword Planner to perform keyword research and plan SEO-driven articles.",
      "Monitored performance using Google Analytics to refine strategies for improved engagement.",
    ],
  },
];

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
};

export default function ExperienceCards() {
  const isInView = useInViewAnimation(0.8, "experience-cards");

  return (
    <section
    className={` py-12 px-6 mb-5 max-w-4xl mx-auto
      opacity-0 transform translate-y-8 transition-all duration-700
      ${isInView ? "hero-anim-title delay-200 opacity-100 translate-y-0" : ""}
    `}
  >
    <h2 className="text-3xl font-bold text-[#90a0d9] text-center mb-12">
      Experience
    </h2>
    <div
      id="experience-cards"
      className="flex flex-col gap-10 max-w-5xl mx-auto"
    >
      {experienceData.map((exp, idx) => (
        <div
          key={idx}
          className={`
            flex flex-col gap-6 rounded-xl
            border-t-2 border-l-2 border-[#90a0d9]
            shadow-xl shadow-[#171f31]
            hover:border-t-8 hover:border-l-8
            px-4 py-8  sm:p-8 md:flex-row md:items-center md:gap-8
          `}
        >
          <div className="flex flex-row items-center justify-between md:flex-col md:w-1/4 gap-2 md:gap-6">
            <Image
              src={exp.logo}
              alt={exp.logoAlt}
              width={80}
              height={60}
              className="object-contain w-[80px] sm:w-[120px]"
              priority={idx === 0}
            />
            <div className="whitespace-nowrap md:text-right text-sm font-medium">
              {new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.startDate)} -{' '}
              {exp.currentlyWorkHere
                ? 'Present'
                : exp.endDate
                  ? new Intl.DateTimeFormat('en-US', dateFormatOptions).format(exp.endDate)
                  : 'Present'}
            </div>
          </div>
  
          <div className="flex flex-col md:w-3/4 gap-4">
            <h3 className="font-semibold text-[#90a0d9] text-lg">
              {exp.position}
            </h3>
            <ul className="list-disc pl-5 space-y-2 ">
              {exp.summary.map((sentence, i) => (
                <li key={i} className="leading-relaxed">
                  {sentence}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
  
  );
}
