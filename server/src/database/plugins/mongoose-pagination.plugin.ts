import { IPaginatedData, IPaginationOption } from "../../interfaces";

/**
 * @description
 *
 * This plugin adds paginate method to a mongoose model
 * ```
 * import { paginationPlugin, IPaginatedModel } from "./mongoose-pagination.plugin";
 *
 * MySchema.plugin(paginationPlugin, {defaultLimit: 10}); //second arguement is optional
 * export default model<MyDocumentType, IPaginatedModel<MyDocumentType>>('my_collection_name', MySchema);
 * ```
 * @name paginationPlugin
 * @param {object} schema Mongoose shcema
 * @param {object} [config] Plugin configuration
 * @param {number} [config.defaultLimit = 10] pagination default limit
 */
export const paginationPlugin = (
  schema: any,
  config: { name?: string; defaultLimit?: number } = {},
) => {
  /**
   * @method paginate
   * @param {IPaginationOption} options
   * @param {number} [options.page = 1] The page to return
   * @param {number} [options.limit = 10] Number of items to return per page
   * @return {Promise<IPaginatedData>} Paginated data
   */
  schema.query.paginate = async function paginate(
    options: IPaginationOption,
  ): Promise<IPaginatedData> {
    let limit = parseInt(String(options.limit || config.defaultLimit || 10), 10);
    limit = limit < 1 ? 10 : limit;

    const page = Math.max(parseInt(String(options.page), 10), 1);

    const offset = (page - 1) * limit;
    const [records, totalItems] = await Promise.all([
      this.limit(limit).skip(offset),
      this.model.countDocuments(this.getQuery()),
    ]);

    const pageCount = Math.ceil(totalItems / limit) || 1;

    return {
      name: config.name || "Unknown",
      size: records.length,
      limit,
      pageCount,
      page,
      previousPage: page > 1 ? Math.min(page - 1, pageCount) : null,
      nextPage: page < pageCount ? page + 1 : null,
      totalItems,
      records,
    };
  };
};
