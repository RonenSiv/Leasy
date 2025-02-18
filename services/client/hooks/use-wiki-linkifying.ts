import useSWR from "swr";
import { enhanceContent } from "@/app/utils/wiki-logic";

export function useLinkifiedContent({
  summary,
  lectureId,
}: {
  summary: string;
  lectureId: string;
}) {
  const fetcher = async () => {
    if (summary?.trim()) {
      return await enhanceContent(summary);
    }
    return null;
  };

  const { data, error, isLoading } = useSWR(
    `linkified-content-${lectureId}`,
    fetcher,
  );

  return {
    linkifiedContent: data,
    isError: error,
    isLoading,
  };
}
