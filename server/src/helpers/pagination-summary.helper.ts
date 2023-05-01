import { IPaginatedData, IPaginationOption } from "../interfaces";

/**
 * @function getPaginationSummary
 * @description
 *
 * This functions produces summary details of paginated records
 * ```
 * import { getPaginationSummary } from "./pagination-summary.helper";
 * ```
 *
 * @param {any[]} records
 * @param {number} totalItemCount
 * @param {IPaginationOption} options
 * @param {stirng} name
 * @returns {Promise<IPaginatedData>}
 */
export async function getPaginationSummary(
  records: any[],
  totalItems: number,
  options: IPaginationOption,
  name?: string,
): Promise<IPaginatedData> {
  let limit = parseInt(String(options.limit), 10);
  limit = limit < 1 ? 10 : limit;

  const page = Math.max(parseInt(String(options.page), 10), 1);
  const pageCount = Math.ceil(totalItems / limit) || 1;

  return {
    name: name || "Unknown",
    size: records.length,
    limit,
    pageCount,
    page,
    previousPage: page > 1 ? Math.min(page - 1, pageCount) : null,
    nextPage: page < pageCount ? page + 1 : null,
    totalItems,
    records,
  };
}
