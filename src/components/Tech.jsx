import React from "react";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { TechPartCanvas } from "./canvas";

const Tech = () => {
    return (
        <div className='flex flex-row flex-wrap justify-center gap-10'>
            {technologies.map((technology) => (
                <div className='w-28 h-28' key={technology.name}>
                    <TechPartCanvas icon={technology.icon} />
                </div>
            ))}
        </div>
    );
};

const TechSection = SectionWrapper(Tech, "");
export default TechSection;
