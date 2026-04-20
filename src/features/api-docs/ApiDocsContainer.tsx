'use client';

import { useState, useEffect, useMemo } from 'react';
import { API_DATA, GUIDE_DATA, ApiEndpoint } from './data/api-data';
import { Sidebar } from './components/Sidebar';
import { ApiDetail } from './components/ApiDetail';
import { CodeSnippet } from './components/CodeSnippet';
import { secureLoad } from '@/utils/storage-utils';
import { AUTH_CONFIG } from '@/constants/constants';

export function ApiDocsContainer() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(GUIDE_DATA[0].id);
  const [selectedType, setSelectedType] = useState<'api' | 'guide'>('guide');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeResponseStatus, setActiveResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const allEndpoints = useMemo(() => API_DATA.flatMap(g => g.endpoints), []);
  const allNavigateItems = useMemo(() => [
    ...GUIDE_DATA.map(g => ({ id: g.id, type: 'guide' as const, title: g.title })),
    ...allEndpoints.map(e => ({ id: e.id, type: 'api' as const, title: e.description }))
  ], [allEndpoints]);

  const selectedItem = useMemo(() => {
    if (selectedType === 'guide') return GUIDE_DATA.find(g => g.id === selectedId);
    return allEndpoints.find(e => e.id === selectedId);
  }, [selectedId, selectedType, allEndpoints]);

  // Initialize form values and default response status when endpoint changes
  useEffect(() => {
    if (selectedType === 'api' && selectedItem) {
      const endpoint = selectedItem as ApiEndpoint;
      setActiveResponseStatus(endpoint.responses[0]?.status || 200);
      
      const storedCredentials = secureLoad<any>(AUTH_CONFIG.docsCredentialsKey);
      const initialValues: Record<string, any> = {};
      
      const addDefaults = (params?: Record<string, any>) => {
        if (params) {
          Object.entries(params).forEach(([key, info]) => {
            // Check if we have a stored value for this key (e.g., clientId, clientSecret)
            if (storedCredentials && storedCredentials[key]) {
              initialValues[key] = storedCredentials[key];
            } else {
              initialValues[key] = info.defaultValue ?? '';
            }
          });
        }
      };

      addDefaults(endpoint.params);
      addDefaults(endpoint.query);
      addDefaults(endpoint.body);
      setFormValues(initialValues);
    } else {
      setActiveResponseStatus(null);
    }
  }, [selectedId, selectedType, selectedItem]);

  const handleSelect = (id: string, type: 'api' | 'guide') => {
    setSelectedId(id);
    setSelectedType(type);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const currentIndex = allNavigateItems.findIndex(item => item.id === selectedId);
  const prevItem = currentIndex > 0 ? allNavigateItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allNavigateItems.length - 1 ? allNavigateItems[currentIndex + 1] : null;

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary selection:text-primary-foreground antialiased overflow-hidden">
      <div className="hidden">
        {/* Scrollbar styles moved to global or handled via tailwind classes */}
      </div>
      
      <Sidebar 
        groups={API_DATA} 
        selectedId={selectedId}
        selectedType={selectedType}
        onSelect={handleSelect}
      />
      
      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar relative px-16 bg-background">
        <ApiDetail 
          key={selectedId}
          item={selectedItem!} 
          type={selectedType}
          formValues={formValues}
          onFormChange={(key, val) => setFormValues(prev => ({ ...prev, [key]: val }))}
          activeResponseStatus={activeResponseStatus}
          onResponseStatusChange={setActiveResponseStatus}
          prevItem={prevItem}
          nextItem={nextItem}
          onNavigate={handleSelect}
        />
      </main>

      {selectedType === 'api' && (
        <CodeSnippet 
          endpoint={selectedItem as any} 
          formValues={formValues}
          activeResponseStatus={activeResponseStatus}
        />
      )}
    </div>
  );
}
