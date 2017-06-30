"use strict";
let Promise = require("bluebird");
let lodash = require("lodash");
let _remove = lodash.remove;
let _assign = lodash.assign;
let logger = require("../../utils/log");


const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;
const DEFAULT_PAGE = 1;

let logMetadata = {
    module: "repository.pagination",
    method: ""
};


/**
 * Exports a plugin to pass into the bookshelf instance, i.e.:
 *
 *      import config from './knexfile';
 *      import knex from 'knex';
 *      import bookshelf from 'bookshelf';
 *
 *      const ORM = bookshelf(knex(config));
 *
 *      ORM.plugin('bookshelf-pagination-plugin');
 *
 *      export default ORM;
 *
 * The plugin attaches two instance methods to the bookshelf
 * Model object: orderBy and fetchPage.
 *
 * Model#orderBy calls the underlying query builder's orderBy method, and
 * is useful for ordering the paginated results.
 *
 * Model#fetchPage works like Model#fetchAll, but returns a single page of
 * results instead of all results, as well as the pagination information
 *
 * See methods below for details.
 */
module.exports = function paginationPlugin(bookshelf) {

    /**
     * @method Model#orderBy
     * @since 0.9.3
     * @description
     *
     * Specifies the column to sort on and sort order.
     *
     * The order parameter is optional, and defaults to 'ASC'. You may
     * also specify 'DESC' order by prepending a hyphen to the sort column
     * name. `orderBy("date", 'DESC')` is the same as `orderBy("-date")`.
     *
     * Unless specified using dot notation (i.e., "table.column"), the default
     * table will be the table name of the model `orderBy` was called on.
     *
     * @example
     *
     * Cars.forge().orderBy('color', 'ASC').fetchAll()
     *    .then(function (rows) { // ...
     *
     * @param sort {string}
     *   Column to sort on
     * @param order {string}
     *   Ascending ('ASC') or descending ('DESC') order
     */
    function orderBy(sort, order) {
        const tableName = this.constructor.prototype.tableName;
        const idAttribute = this.constructor.prototype.idAttribute ?
            this.constructor.prototype.idAttribute : 'id';

        let _sort;

        if (sort && sort.indexOf('-') === 0) {
            _sort = sort.slice(1);
        }
        else if (sort) {
            _sort = sort;
        }
        else {
            _sort = idAttribute;
        }

        const _order = order || (
            (sort && sort.indexOf('-') === 0) ? 'DESC' : 'ASC'
        );

        if (_sort.indexOf('.') === -1) {
            _sort = `${tableName}.${_sort}`;
        }

        return this.query(qb => {
            qb.orderBy(_sort, _order);
        });
    }

    /**
     * Similar to {@link Model#fetchAll}, but fetches a single page of results
     * as specified by the limit (page size) and offset or page number.
     *
     * Any options that may be passed to {@link Model#fetchAll} may also be passed
     * in the options to this method.
     *
     * To perform pagination, you may include *either* an `offset` and `limit`, **or**
     * a `page` and `pageSize`.
     *
     * By default, with no parameters or missing parameters, `fetchPage` will use an
     * options object of `{page: 1, pageSize: 10}`
     *
     *
     * Below is an example showing the user of a JOIN query with sort/ordering,
     * pagination, and related models.
     *
     * @example
     *
     * Car
     * .query(function (qb) {
     *    qb.innerJoin('manufacturers', 'cars.manufacturer_id', 'manufacturers.id');
     *    qb.groupBy('cars.id');
     *    qb.where('manufacturers.country', '=', 'Sweden');
     * })
     * .orderBy('-productionYear') // Same as .orderBy('cars.productionYear', 'DESC')
     * .fetchPage({
     *    pageSize: 15, // Defaults to 10 if not specified
     *    page: 3, // Defaults to 1 if not specified
     *
     *    // OR
     *    // limit: 15,
     *    // offset: 30,
     *
     *    withRelated: ['engine'] // Passed to Model#fetchAll
     * })
     * .then(function (results) {
     *    console.log(results); // Paginated results object with metadata example below
     * })
     *
     * // Pagination results:
     *
     * {
     *    models: [<Car>], // Regular bookshelf Collection
     *    // other standard Collection attributes
     *    ...
     *    pagination: {
     *        rowCount: 53, // Total number of rows found for the query before pagination
     *        pageCount: 4, // Total number of pages of results
     *        page: 3, // The requested page number
     *        pageSze: 15, // The requested number of rows per page
     *
     *  // OR, if limit/offset pagination is used instead of page/pageSize:
     *        // offset: 30, // The requested offset
     *        // limit: 15 // The requested limit
     *    }
     * }
     *
     * @param options {object}
     *    The pagination options, plus any additional options that will be passed to
     *    {@link Model#fetchAll}
     * @returns {Promise<Model|null>}
     */
    function fetchPage(options) {
        logMetadata.method = "fetchPage";
        logger.log.debug(logger.utils.dividerDots, logMetadata);
        logger.log.debug("options: %s", JSON.stringify(options), logMetadata);

        options = (typeof options !== "undefined") ? options : {};
        var _this = this;

        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var page = options.page;
        var pageSize = options.pageSize;
        var limit = options.limit;
        var offset = options.offset;
        var fetchOptions = options; //(0, _objectWithoutProperties3.default)(options, ['page', 'pageSize', 'limit', 'offset']);
        delete fetchOptions.page;
        delete fetchOptions.pageSize;
        delete fetchOptions.limit;
        delete fetchOptions.offset;
        logger.log.debug("fetchOptions: %s", JSON.stringify(fetchOptions), logMetadata);

        let usingPageSize = false; // usingPageSize = false means offset/limit, true means page/pageSize
        let _page;
        let _pageSize;
        let _limit;
        let _offset;

        function ensureIntWithDefault(val, def) {
            if (!val) {
                return def;
            }

            const _val = parseInt(val);
            if (Number.isNaN(_val)) {
                return def;
            }

            return _val;
        }

        if (!limit && !offset) {
            usingPageSize = true;

            _pageSize = ensureIntWithDefault(pageSize, DEFAULT_LIMIT);
            _page = ensureIntWithDefault(page, DEFAULT_PAGE);

            _limit = _pageSize;
            _offset = _limit * (_page - 1);
        }
        else {
            _pageSize = _limit; // not used, just for eslint `const` error
            _limit = ensureIntWithDefault(limit, DEFAULT_LIMIT);
            _offset = ensureIntWithDefault(offset, DEFAULT_OFFSET);
        }

        const tableName = this.constructor.prototype.tableName;
        const idAttribute = this.constructor.prototype.idAttribute ?
            this.constructor.prototype.idAttribute : 'id';

        logger.log.debug("tableName: %s", tableName, logMetadata);
        logger.log.debug("idAttribute: %s", idAttribute, logMetadata);

        var paginate = function paginate() {
            return _this.constructor
                .forge()
                .query(qb => {
                    _assign(qb, _this.query().clone());
                    qb.limit.apply(qb, [_limit]);
                    qb.offset.apply(qb, [_offset]);
                    logger.log.debug("qb (function paginate): %s", qb, logMetadata);
                    return null;
                })
                .fetchAll(fetchOptions);
        };

        var count = function count() {
            const notNeededQueries = [
                'orderByBasic',
                'orderByRaw',
                'groupByBasic',
                'groupByRaw'
            ];
            return _this.constructor
                .forge()
                //.query()
                .query(qb => {
                    _assign(qb, _this.query().clone());
                    logger.log.debug("qb (function count) before: %s", qb, logMetadata);

                    // Remove grouping and ordering. Ordering is unnecessary
                    // for a count, and grouping returns the entire result set
                    // What we want instead is to use `DISTINCT`
                    _remove(qb._statements, statement => {
                        return (notNeededQueries.indexOf(statement.type) > -1) ||
                            statement.grouping === 'columns';
                    });

                    logger.log.debug("qb (function count) after: %s", qb, logMetadata);
                    return null;
                })
                .count(tableName + "." + idAttribute);
        };

        return Promise.join(paginate(), count(), function(rows, count) {
            logger.log.debug("count: %s", JSON.stringify(count), logMetadata);
            logger.log.debug("rows: %s", JSON.stringify(rows), logMetadata);

            var metadata = usingPageSize ? {
                page: _page,
                pageSize: _limit
            } : {
                offset: _offset,
                limit: _limit
            };
            if (count) {
                metadata.rowCount = parseInt(count);
            }
            else {
                metadata.rowCount = 0;
            }
            logger.log.debug("metadata: %s", JSON.stringify(metadata), logMetadata);

            const pageCount = Math.ceil(metadata.rowCount / _limit);
            const pageData = _assign(metadata, {
                pageCount
            });

            logger.log.debug("pageData: %s", JSON.stringify(pageData), logMetadata);

            const result = {
                models: [],
                pagination: {}
            };
            result.models = rows;
            result.pagination = pageData;
            logger.log.debug("result: %s", JSON.stringify(result), logMetadata);

            return result;
        });
    }

    if (typeof bookshelf.Model.prototype.orderBy === 'undefined') {
        bookshelf.Model.prototype.orderBy = orderBy;
    }

    bookshelf.Model.prototype.fetchPage = fetchPage;

    bookshelf.Model.fetchPage = function() {
        var _forge;

        return (_forge = this.forge()).fetchPage.apply(_forge, arguments);
    };

    bookshelf.Collection.prototype.fetchPage = function() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return fetchPage.apply.apply(fetchPage, [this.model.forge()].concat(args));
    };

    /*
        bookshelf.Model.fetchPage = function(...args) {
            return this.forge().fetchPage(...args);
        }

        bookshelf.Collection.prototype.fetchPage = function(...args) {
            return fetchPage.apply(this.model.forge(), ...args);
        };
        */

}
