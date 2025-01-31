import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import "./tailwind.css";

const LoadingSkeleton = () => (
  <>
    <main className="flex-grow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="mb-6">
          <Skeleton className="w-[224px] max-w-full" />
        </h1>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="border">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight">
                <Skeleton className="w-[128px] max-w-full" />
              </div>
              <SVGSkeleton className="w-[24px] h-[24px]" />
            </div>
            <div className="p-6 pt-0">
              <div>
                <Skeleton className="w-[72px] max-w-full" />
              </div>
            </div>
          </div>
          <div className="border">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight">
                <Skeleton className="w-[88px] max-w-full" />
              </div>
              <SVGSkeleton className="w-[24px] h-[24px]" />
            </div>
            <div className="p-6 pt-0">
              <div>
                <Skeleton className="w-[40px] max-w-full" />
              </div>
            </div>
          </div>
          <div className="border">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight">
                <Skeleton className="w-[120px] max-w-full" />
              </div>
              <SVGSkeleton className="w-[24px] h-[24px]" />
            </div>
            <div className="p-6 pt-0">
              <div>
                <Skeleton className="w-[24px] max-w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="border">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="leading-none tracking-tight">
                <Skeleton className="w-[104px] max-w-full" />
              </div>
              <div>
                <Skeleton className="w-[184px] max-w-full" />
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="w-full">
                <div className="relative h-2 w-full">
                  <div className="h-full w-full flex-1"></div>
                </div>
                <p className="mt-2">
                  <Skeleton className="w-[136px] max-w-full" />
                </p>
              </div>
            </div>
          </div>
          <div className="border">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="leading-none tracking-tight">
                <Skeleton className="w-[136px] max-w-full" />
              </div>
              <div>
                <Skeleton className="w-[296px] max-w-full" />
              </div>
            </div>
            <div className="p-6 pt-0">
              <div>
                <div className="inline-flex h-9 items-center justify-center p-1 mb-4">
                  <div className="inline-flex items-center justify-center px-3 py-1 border">
                    <Skeleton className="w-[80px] max-w-full" />
                  </div>
                  <div className="inline-flex items-center justify-center px-3 py-1 border">
                    <Skeleton className="w-[40px] max-w-full" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-[300px] w-full">
                    <div className="recharts-responsive-container">
                      <div>
                        <SVGSkeleton className="w-[674px] h-[300px]" />
                        <div className="recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-bottom">
                          <div>
                            <p className="recharts-tooltip-label"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2"></div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="mb-4">
          <Skeleton className="w-[104px] max-w-full" />
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <div className="border h-full flex flex-col">
              <div className="relative h-72">
                <SVGSkeleton className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="tracking-tight">
                  <Skeleton className="w-[168px] max-w-full" />
                </div>
                <div>
                  <Skeleton className="w-[200px] max-w-full" />
                </div>
              </div>
              <div className="flex items-center p-6 pt-0 mt-auto">
                <a className="inline-flex items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 px-4 py-2 w-full">
                  <Skeleton className="w-[80px] max-w-full" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="border h-full flex flex-col">
              <div className="relative h-72">
                <SVGSkeleton className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="tracking-tight">
                  <Skeleton className="w-[224px] max-w-full" />
                </div>
                <div>
                  <Skeleton className="w-[200px] max-w-full" />
                </div>
              </div>
              <div className="flex items-center p-6 pt-0 mt-auto">
                <a className="inline-flex items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 px-4 py-2 w-full">
                  <Skeleton className="w-[80px] max-w-full" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <a className="inline-flex items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 px-4 py-2">
            <Skeleton className="w-[128px] max-w-full" />
          </a>
          <a className="inline-flex items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input shadow-sm h-9 px-4 py-2">
            <Skeleton className="w-[136px] max-w-full" />
          </a>
        </div>
      </div>
    </main>
    <footer className="border-t mt-16 pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4">
              <Skeleton className="w-[88px] max-w-full" />
            </h3>
            <p>
              <Skeleton className="w-[912px] max-w-full" />
            </p>
          </div>
          <div>
            <h3 className="mb-4">
              <Skeleton className="w-[88px] max-w-full" />
            </h3>
            <ul className="space-y-2">
              <li>
                <a>
                  <Skeleton className="w-[32px] max-w-full" />
                </a>
              </li>
              <li>
                <a>
                  <Skeleton className="w-[40px] max-w-full" />
                </a>
              </li>
              <li>
                <a>
                  <Skeleton className="w-[64px] max-w-full" />
                </a>
              </li>
              <li>
                <a>
                  <Skeleton className="w-[56px] max-w-full" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4">
              <Skeleton className="w-[40px] max-w-full" />
            </h3>
            <ul className="space-y-2">
              <li>
                <a>
                  <Skeleton className="w-[128px] max-w-full" />
                </a>
              </li>
              <li>
                <a>
                  <Skeleton className="w-[112px] max-w-full" />
                </a>
              </li>
              <li>
                <a>
                  <Skeleton className="w-[104px] max-w-full" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4">
              <Skeleton className="w-[120px] max-w-full" />
            </h3>
            <div className="flex space-x-4">
              <a>
                <SVGSkeleton className="w-[20px] h-[20px]" />
              </a>
              <a>
                <SVGSkeleton className="w-[20px] h-[20px]" />
              </a>
              <a>
                <SVGSkeleton className="w-[20px] h-[20px]" />
              </a>
              <a>
                <SVGSkeleton className="w-[20px] h-[20px]" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p>
            <Skeleton className="w-[272px] max-w-full" />
          </p>
        </div>
      </div>
    </footer>
    <div className="tsqd-parent-container">
      <div className="tsqd-transitions-container">
        <div className="tsqd-open-btn-container">
          <div>
            <SVGSkeleton className="w-4 h-4" />
          </div>
          <div>
            <SVGSkeleton className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
    <div className="tsqd-parent-container">
      <div className="tsqd-transitions-container">
        <div className="tsqd-open-btn-container">
          <div>
            <SVGSkeleton className="w-4 h-4" />
          </div>
          <div>
            <SVGSkeleton className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
    <script></script>
    <script>
      <Skeleton className="w-[576px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[1096px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[18064px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[18992px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[8368px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[23272px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[17112px] max-w-full" />
    </script>
    <script>
      <Skeleton className="w-[3040px] max-w-full" />
    </script>
    <span>
      <Skeleton className="w-[14px] max-w-full" />
    </span>
  </>
);

const SandboxPreview = () => (
  <div className="flex justify-center w-full h-full p-10">
    <LoadingSkeleton />
  </div>
);

export default SandboxPreview;
