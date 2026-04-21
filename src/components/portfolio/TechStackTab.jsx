import React from "react";
import TechStackIcon from "../TechStackIcon";

const techStacks = [
    { icon: "html.svg", language: "HTML" },
    { icon: "css.svg", language: "CSS" },
    { icon: "javascript.svg", language: "JavaScript" },
    { icon: "tailwind.svg", language: "Tailwind CSS" },
    { icon: "reactjs.svg", language: "ReactJS" },
    { icon: "vite.svg", language: "Vite" },
    { icon: "nodejs.svg", language: "Node JS" },
    { icon: "bootstrap.svg", language: "Bootstrap" },
    { icon: "firebase.svg", language: "Firebase" },
    { icon: "MUI.svg", language: "Material UI" },
    { icon: "vercel.svg", language: "Vercel" },
    { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

const TechStackTab = () => (
    <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
            {techStacks.map((stack, index) => (
                <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                </div>
            ))}
        </div>
    </div>
);

export default TechStackTab;
