export const LearnPageSkeleton = () => {
  return (
    <div
      className={
        "flex flex-row items-start justify-start w-full h-screen gap-2"
      }
    >
      <div
        className={
          "flex flex-col items-start justify-start w-full h-full flex-1 gap-10"
        }
      >
        <div
          role="status"
          className="flex items-center justify-center h-1/2 w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>

        <div role="status" className="space-y-2.5 animate-pulse w-full h-1/2">
          <div className="flex items-center w-full">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[480px]">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
          </div>
          <div className="flex items-center w-full max-w-[400px]">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[480px]">
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
          </div>
          <div className="flex items-center w-full max-w-[440px]">
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[360px]">
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
            <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div
        role="status"
        className="p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 w-1/3 h-full"
      >
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
        <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="flex items-baseline mt-4">
          <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
          <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
          <div className="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};