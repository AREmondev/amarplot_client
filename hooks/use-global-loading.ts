import { useLoading } from '@/components/common/loading-provider';

export function useGlobalLoading() {
  const { isLoading, setLoading, loadingMessage, setLoadingMessage } = useLoading();

  const showLoading = (message?: string) => {
    if (message) {
      setLoadingMessage(message);
    }
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    loadingMessage,
    setLoadingMessage,
  };
}