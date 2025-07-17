// utils/appFeatures.ts
import { Query } from 'mongoose';

interface QueryString {
  [key: string]:string;
}

export default class AppFeatures<T> {
  databaseQuery: Query<T[], T>;
  queryString: QueryString;

  constructor(databaseQuery: Query<T[], T>, queryString: QueryString) {
    this.databaseQuery = databaseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach(el => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.databaseQuery = this.databaseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.databaseQuery = this.databaseQuery.sort(`-${sortBy}`);
    } else {
      this.databaseQuery = this.databaseQuery.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.databaseQuery = this.databaseQuery.select(fields);
    } else {
      this.databaseQuery = this.databaseQuery.select('-__v');
    }
    return this;
  }

  pagination() {
    const limit = this.queryString.limit ? parseInt(this.queryString.limit) : 10;
    const page = this.queryString.page ? parseInt(this.queryString.page) : 1;
    const skip = (page - 1) * limit;

    this.databaseQuery = this.databaseQuery.skip(skip).limit(limit);
    return this;
  }
}
