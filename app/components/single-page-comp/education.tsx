"use client"
import useInViewAnimation from "@/app/hooks/useInViewAnimation"
import "../../education.css"

export default function Education() {
  const isInView = useInViewAnimation(0.8, "education")

  const educationData = [
    {
      period: "Jan 2024 - Jan 2028",
      degree: "Bachelor's Degree",
      institution: "Pulchowk Campus",
      description:
        "Currently pursuing a Bachelor's degree in Computer Engineering, focusing on building a strong foundation in technical skills and innovative problem-solving approaches.",
    },
    {
      period: "Mar 2021 - Mar 2023",
      degree: "Higher Secondary Education",
      institution: "KIST COLLEGE & SS",
      description:
        "Completed higher secondary education with a strong focus on science and mathematics. Developed analytical thinking and problem-solving skills through rigorous coursework.",
    },
    {
      period: "Jan 2016 - Jan 2021",
      degree: "Secondary Education (SEE)",
      institution: "Navodaya Shishu Sadan",
      description:
        "Completed secondary education with excellence in science and mathematics. Participated in various academic competitions and extracurricular activities.",
    },
    {
      period: "Early Education",
      degree: "Primary Education",
      institution: "Sagarmatha Lower Secondary School",
      description:
        "Built a strong educational foundation during primary schooling, where curiosity and love for learning were nurtured.",
    },
  ]

  return (
    <div
      id="education"
      className="flex flex-col mt-15  sm:ml-[100px]  lg:ml-[200px] pb-5 sm:px-0 pl-2"
    >
      <div>
        <h1
          className={`text-3xl mb-5 font-bold text-[#90A0D9] title-line opacity-0 ${
            isInView ? "hero-anim-title delay-200 opacity-100" : ""
          }`}
        >
          Education
        </h1>
      </div>


      <div
        className={`education-timeline-vertical md:hidden mt-10 opacity-0 ${isInView ? "hero-anim delay-400 opacity-100" : ""}`}
      >
        {educationData.map((item, index) => (
          <div key={index} className="timeline-item-vertical">
            <div className="timeline-dot-vertical"></div>
            <div className="timeline-date-vertical">
              <span>{item.period}</span>
            </div>
            <div className="timeline-content-vertical">
              <h3>{item.degree}</h3>
              <h4>{item.institution}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

  
      <div
        className={`hidden md:block education-timeline-horizontal mt-16 opacity-0 ${isInView ? "hero-anim delay-400 opacity-100" : ""}`}
      >
        <div className="timeline-track">
          {/* <div className="timeline-line"></div> */}

          <div className="timeline-items-container">
            {educationData.map((item, index) => (
              <div key={index} className={`timeline-item-horizontal ${isInView ? `animate-item-${index}` : ""}`}>
                <div className="timeline-dot-horizontal"></div>
                <div className="timeline-content-horizontal">
                  <h3>{item.degree}</h3>
                  <h4>{item.institution}</h4>
                  <span className="timeline-period">{item.period}</span>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

 
    </div>
  )
}
