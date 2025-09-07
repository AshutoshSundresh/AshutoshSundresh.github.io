'use client';

import { useState } from 'react';

export default function useTabHistory(initialTab: number) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabHistory, setTabHistory] = useState<number[]>([initialTab]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const handleTabChange = (tabId: number) => {
    if (tabId !== activeTab) {
      const newHistory = tabHistory.slice(0, currentHistoryIndex + 1);
      setTabHistory([...newHistory, tabId]);
      setCurrentHistoryIndex(newHistory.length);
      setActiveTab(tabId);
    }
  };

  const handleBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setActiveTab(tabHistory[currentHistoryIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentHistoryIndex < tabHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setActiveTab(tabHistory[currentHistoryIndex + 1]);
    }
  };

  return { activeTab, handleTabChange, handleBack, handleForward, tabHistory, currentHistoryIndex };
}


