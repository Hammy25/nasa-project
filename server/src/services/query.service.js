function getPagination(query){
	const limit = Math.abs(query.limit);
	const page = Math.abs(query.page);
	const skip = (page - 1) * limit;
	return({
		skip,
		limit
	});
}

module.exports = {
	getPagination
}