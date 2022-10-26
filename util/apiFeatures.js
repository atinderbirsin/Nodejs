class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // const queryObj = { ...this.queryString };
    // console.log(queryObj);
    // queryObj.user_type = 2;
    // const excludedFields = ['limit', 'sort', 'page', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // Step 1(B) Advanced Filtering
    // this.queryString = JSON.stringify(queryObj);
    // this.queryString = this.queryString.replace(
    //   /\b(lte|lt|gte|gt)\b/g,
    //   (match) => `$${match}`
    // );
    // this.queryString = JSON.parse(this.queryString);

    // this.queryString.user_type = 2;

    this.query = this.query.find(this.queryString);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-created_at');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page * 1 || 1;
    const limit = +this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default apiFeatures;
