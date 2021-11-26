
const asyncErrorWrapper=require("express-async-handler");
const { populateHelper,
    searchHelper,
    questionSortHelper,
    paginationHelper 
} = require("./queryMiddlewareHelpers");
const questionQueryMiddleware=function (model,options) {


    return asyncErrorWrapper(async function (req,res,next) {

    let query= model.find();

    query=searchHelper('title',query,req);

    if(options&&options.population){
        query = populateHelper(query, options.population)
    }

    query= questionSortHelper(query, req);//questıon a göre sort
    
    const total= await model.countDocuments();
    const paginationResult = await paginationHelper(total,query,req)

    query = paginationResult.query;
    const pagination= paginationResult.pagination;

    const queryResults = await query;

    res.queryResults={
        success:true,
        count:queryResults.length,
        pagination:pagination,
        data:queryResults
    }
    next();
});
};
module.exports=questionQueryMiddleware;
