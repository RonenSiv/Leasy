"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// const Feature = ({
//   icon,
//   title,
//   description,
//   link,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   link: string;
// }) => {
//   return (
//     <div className="max-w-md sm:mx-auto sm:text-center flex flex-col items-center justify-center">
//       <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-action  sm:mx-auto sm:w-24 sm:h-24">
//         {icon}
//       </div>
//       <h6 className="mb-3 text-xl font-bold leading-5">{title}</h6>
//       <p className="mb-3 text-sm text-gray-900 dark:text-gray-50 text-center">
//         {description}
//       </p>
//       <Link
//         href={link}
//         aria-label=""
//         className="inline-flex items-center font-semibold transition-colors duration-200 text-blue-400 dark:text-blue-200 hover:text-blue-300 dark:hover:text-blue-400"
//       >
//         Learn more
//       </Link>
//     </div>
//   );
// };
//
// export const Features = () => {
//   return (
//     <section className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full md:px-24 lg:px-8 lg:py-20 bg-white dark:bg-gray-800 w-full">
//       <div className="max-w-xl mb-10 md:mx-auto sm:text-center md:mb-12  flex flex-col items-center justify-center rounded-lg">
//         <div>
//           <p className="inline-block mb-4 text-xs font-semibold tracking-wider text-gray-50 uppercase rounded-full bg-teal-accent-400 dark:text-gray-800 bg-action p-3">
//             Features
//           </p>
//         </div>
//         <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto dark:text-gray-200">
//           <span className="relative inline-block">
//             <svg
//               viewBox="0 0 52 24"
//               fill="currentColor"
//               className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
//             >
//               <defs>
//                 <pattern
//                   id="ea469ae8-e6ec-4aca-8875-fc402da4d16e"
//                   x="0"
//                   y="0"
//                   width=".135"
//                   height=".30"
//                 >
//                   <circle cx="1" cy="1" r=".7" />
//                 </pattern>
//               </defs>
//               <rect
//                 fill="url(#ea469ae8-e6ec-4aca-8875-fc402da4d16e)"
//                 width="52"
//                 height="24"
//               />
//             </svg>
//             <span className="relative">Learning</span>
//           </span>{" "}
//           made easy with Leasy
//         </h2>
//         <p className="text-base text-gray-700 dark:text-gray-400 md:text-lg text-center">
//           Leasy streamlines your learning process, providing tools for video
//           summarization, transcription, interactive chatbot, quizzes, and
//           AI-enhanced video features, all in one place. Say goodbye to complex
//           study routines and hello to effortless learning.
//         </p>
//       </div>
//
//       <div className="grid gap-8 row-gap-10 lg:grid-cols-2 justify-center items-center w-full">
//         <Feature
//           icon={
//             <TbWriting className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"Summarization"}
//           description={
//             "Effortlessly condense lengthy lectures into concise summaries, enabling quick review and easy comprehension."
//           }
//           link="/summary"
//         />
//         <Feature
//           icon={
//             <FaRegClosedCaptioning className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"Transcription"}
//           description={
//             "Convert audio and video content into text, making it easier to follow along and understand the content."
//           }
//           link="/transcription"
//         />
//         <Feature
//           icon={
//             <GoDependabot className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"Chatbot"}
//           description={
//             "Interact with a chatbot that answers questions and provides additional information on the content."
//           }
//           link="/chatbot"
//         />
//         <Feature
//           icon={
//             <MdOutlineQuiz className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"Quizzes"}
//           description={
//             "Test your knowledge with interactive quizzes that reinforce learning and retention."
//           }
//           link="/quizzes"
//         />
//         <Feature
//           icon={
//             <MdOutlineOndemandVideo className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"AI-fixes Video Features"}
//           description={
//             "Leverage AI technology to fix video content, providing a smoother watching experience for messed up videos."
//           }
//           link="/ai"
//         />
//         <Feature
//           icon={
//             <GrPersonalComputer className="w-12 h-12 text-gray-50 sm:w-16 sm:h-16 dark:text-gray-800 " />
//           }
//           title={"User-friendly"}
//           description={
//             "Our UI is designed to be user-friendly, making it easy to navigate and use the platform."
//           }
//           link="/ui"
//         />
//       </div>
//     </section>
//   );
// };

const ExampleContents = [
  {
    imgUrl:
      "https://plus.unsplash.com/premium_photo-1667984733216-9c38d3d308eb?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subheading: "Summarization",
    heading: "Effortlessly condense lengthy lectures.",
    link: "/summary",
    content:
      "Effortlessly condense lengthy lectures into concise summaries, enabling quick review and easy comprehension.",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1597392582469-a697322d5c16?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subheading: "Transcription",
    heading: "Convert audio and video to text.",
    link: "/transcription",
    content:
      "Convert audio and video content into text, making it easier to follow along and understand the content.",
  },
  {
    imgUrl:
      "https://cdn.pixabay.com/photo/2024/05/05/16/30/ai-generated-8741448_1280.jpg",
    subheading: "Chatbot",
    heading: "Interact with our smart chatbot.",
    link: "/chatbot",
    content:
      "Interact with a chatbot that answers questions and provides additional information on the content.",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subheading: "Quizzes",
    heading: "Test your knowledge with quizzes.",
    link: "/quizzes",
    content:
      "Test your knowledge with interactive quizzes that reinforce learning and retention.",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subheading: "AI-fixes",
    heading: "Fix video content with AI technology.",
    link: "/ai",
    content:
      "Leverage AI technology to fix video content, providing a smoother watching experience for messed up videos.",
  },
];

const IMG_PADDING = 30;

export const Features = () => {
  return (
    <div className="bg-background py-10">
      {ExampleContents.map((content, index) => (
        <TextParallaxContent
          key={index}
          imgUrl={content.imgUrl}
          subheading={content.subheading}
          heading={content.heading}
        >
          <ExampleContent
            title={content.subheading}
            description={content.content}
            link={content.link}
          />
        </TextParallaxContent>
      ))}
    </div>
  );
};

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh] md:w-[50vw] min-w-[300px]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({
  subheading,
  heading,
}: {
  subheading: string;
  heading: string;
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <div className="col-span-1 md:col-span-8"></div>
  </div>
);
