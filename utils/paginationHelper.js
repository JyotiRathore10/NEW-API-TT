/**
 * Pagination Helper
 * Provides utilities for implementing lazy loading with pagination
 */

/**
 * Validate and normalize pagination parameters
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Records per page (default: 10, max: 100)
 * @returns {Object} { pageNum, limitNum, offset }
 */
const validatePaginationParams = (page, limit) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, offset };
};

/**
 * Build pagination metadata response
 * @param {number} currentPage - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} totalRecords - Total number of records
 * @returns {Object} Pagination metadata
 */
const buildPaginationMetadata = (currentPage, pageSize, totalRecords) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startRecord: (currentPage - 1) * pageSize + 1,
    endRecord: Math.min(currentPage * pageSize, totalRecords)
  };
};

/**
 * Format successful paginated response
 * @param {Array} data - Array of records
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} Formatted response
 */
const formatPaginatedResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Error object
 */
const formatErrorResponse = (message, statusCode = 500) => {
  return {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  validatePaginationParams,
  buildPaginationMetadata,
  formatPaginatedResponse,
  formatErrorResponse
};
