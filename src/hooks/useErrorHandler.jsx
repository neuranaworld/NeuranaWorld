import { useState, useCallback } from 'react';
import logger from '../utils/logger';

/**
 * Custom hook for handling errors in functional components
 * @returns {Object} Error handling utilities
 */
export function useErrorHandler() {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback((error, context = '') => {
    logger.error(`Error in ${context}`, error);
    setError(error);
    setIsError(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    resetError,
  };
}

export default useErrorHandler;
