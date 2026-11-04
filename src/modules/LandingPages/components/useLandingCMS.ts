import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";

export interface CmsSectionItem {
  id?: number;
  section_key: string;
  section_name?: string;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  content?: Record<string, any> | null;
  is_active?: boolean;
  order?: number;
}

export type CmsSectionsMap = Record<string, CmsSectionItem>;

// Module-level cache so landing components don't re-fetch multiple times
let cachedData: CmsSectionsMap | null = null;
let fetchPromise: Promise<CmsSectionsMap> | null = null;

async function fetchCmsSections(): Promise<CmsSectionsMap> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get("/cms", { silent: true })
    .then((res: any) => {
      const data = res?.data?.data || res?.data || {};
      cachedData = data;
      return data;
    })
    .catch(() => {
      // Fallback: try /landing-sections
      return apiClient
        .get("/landing-sections", { silent: true })
        .then((res: any) => {
          const data = res?.data?.data || res?.data || {};
          cachedData = data;
          return data;
        })
        .catch(() => {
          return {} as CmsSectionsMap;
        });
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function useLandingCMS() {
  const [sections, setSections] = useState<CmsSectionsMap>(cachedData || {});
  const [isLoading, setIsLoading] = useState(!cachedData);

  useEffect(() => {
    let isMounted = true;
    fetchCmsSections().then((data) => {
      if (isMounted) {
        setSections(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getSection = (key: string): CmsSectionItem | null => {
    return sections[key] || null;
  };

  const isSectionEnabled = (key: string): boolean => {
    if (!sections || Object.keys(sections).length === 0) return true;
    const item = sections[key];
    if (!item) return true;
    return item.is_active !== false;
  };

  return {
    sections,
    isLoading,
    getSection,
    isSectionEnabled,
  };
}
