module.exports = class ApiError extends Error{
	constructor(code, message, errors =[]) {
		super(message);
		this.code = code;
		this.errors = errors
	}

	static BadAPIRequest(message, errors = []) {
		return new ApiError(500, message, errors);
	}

	static UnauthorizedError() {
		return new ApiError(401, 'User is unauthorized');
	}
	
	static searchError(param) {
		return new ApiError(404, `Cannot find ${param.model} with current ${param.name}: ${param.value}`);
	}
}