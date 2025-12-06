import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Hook do programowej nawigacji między zakładkami
 */
export const useTabNavigation = () => {
  const history = useHistory();

  const goToExplore = useCallback(() => {
    history.push('/explore');
  }, [history]);

  const goToRoutes = useCallback(() => {
    history.push('/routes');
  }, [history]);

  const goToTours = useCallback(() => {
    history.push('/tours');
  }, [history]);

  const goToSettings = useCallback(() => {
    history.push('/settings');
  }, [history]);

  return {
    goToExplore,
    goToRoutes,
    goToTours,
    goToSettings,
  };
};
