export const About = () => {
  return (
    <section className="bg-gray-50 dark:bg-[#202E3A] w-full border-0 shadow-none">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="grid grid-cols-2 gap-4 mt-8">
          <img
            className="w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
            alt="office content 1"
          />
          <img
            className="mt-4 w-full lg:mt-10 rounded-lg"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
            alt="office content 2"
          />
        </div>
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400 max-md:mt-4">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Making Learning Effortless
          </h2>
          <p className="mb-4">
            Leasy is not just another education platform. We're a team of
            visionaries, educators, and technologists dedicated to
            revolutionizing the way you learn.
          </p>
          <p>
            Whether you're a student, professional, or lifelong learner, our
            mission is to simplify the learning process. With cutting-edge
            technology and innovative solutions, we're here to make learning
            accessible, engaging, and effective for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};
