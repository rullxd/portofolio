import React from "react";
import CardProject from "../CardProject";

const ToggleButton = ({ onClick, isShowingMore }) => (
    <button
        onClick={onClick}
        className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
    >
        <span className="relative z-10 flex items-center gap-2">
            {isShowingMore ? "See Less" : "See More"}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
            >
                <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
    </button>
);

const ProjectsTab = ({ projects, initialItems, showAllProjects, onToggleShowMore }) => {
    const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

    return (
        <>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {displayedProjects.map((project, index) => (
                        <div
                            key={project.id || index}
                            data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                            data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                        >
                            <CardProject
                                Img={project.img}
                                Title={project.title}
                                Description={project.description}
                                Link={project.link}
                                TechStack={project.tech_stack}
                                id={project.id}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {projects.length > initialItems && (
                <div className="mt-6 w-full flex justify-start">
                    <ToggleButton
                        onClick={onToggleShowMore}
                        isShowingMore={showAllProjects}
                    />
                </div>
            )}
        </>
    );
};

export default ProjectsTab;
