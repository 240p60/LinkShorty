// Custom hook for managing links

import type { ChartDataPoint, Click, CreateLinkInput, Link } from "@app/types";
import { createLink } from "@services/links/create";
import { deleteLink } from "@services/links/delete";
import { getAllLinks } from "@services/links/getAll";
import { getClicksForLink } from "@services/links/getClicks";
import { getLink } from "@services/links/getOne";
import { getClicksOverTime } from "@services/links/getStats";
import { useCallback, useEffect, useState } from "react";

interface UseLinksReturn {
  links: Link[];
  loading: boolean;
  error: string | null;
  refreshLinks: () => Promise<void>;
  addLink: (input: CreateLinkInput) => Promise<Link>;
  removeLink: (shortCode: string) => Promise<void>;
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить ссылки");
    } finally {
      setLoading(false);
    }
  }, []);

  const addLink = useCallback(
    async (input: CreateLinkInput): Promise<Link> => {
      const newLink = await createLink(input);
      await refreshLinks();
      return newLink;
    },
    [refreshLinks],
  );

  const removeLink = useCallback(
    async (shortCode: string): Promise<void> => {
      await deleteLink(shortCode);
      await refreshLinks();
    },
    [refreshLinks],
  );

  useEffect(() => {
    refreshLinks();
  }, [refreshLinks]);

  return {
    links,
    loading,
    error,
    refreshLinks,
    addLink,
    removeLink,
  };
}

interface UseLinkDetailsReturn {
  link: Link | null;
  clicks: Click[];
  chartData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useLinkDetails(shortCode: string): UseLinkDetailsReturn {
  const [link, setLink] = useState<Link | null>(null);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [linkData, clicksData, chartDataResult] = await Promise.all([
        getLink(shortCode),
        getClicksForLink(shortCode),
        getClicksOverTime(shortCode),
      ]);

      if (!linkData) {
        setError("Ссылка не найдена");
        return;
      }

      setLink(linkData);
      setClicks(clicksData);
      setChartData(chartDataResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные ссылки");
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    link,
    clicks,
    chartData,
    loading,
    error,
    refresh,
  };
}
