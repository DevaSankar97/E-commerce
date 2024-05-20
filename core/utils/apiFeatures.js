class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    // console.log(this.queryStr)
    // console.log(this.query)

    }
    search(){
        let keyword = this.queryStr.search ? {
            name:{
                $regex: this.queryStr.search,
                $options: 'i'
            }
        }:{};
        this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};
        const removeFields = ['search','page','limit'];
        removeFields.forEach(remove => delete queryStrCopy[remove]);
        let querys = JSON.stringify(queryStrCopy);
        querys = querys.replace(/\b(gt|gte|lt|lte)/g, match=> `$${match}`)
        this.query.find(JSON.parse(querys));
        return this;
    }
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * currentPage - 1;
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;