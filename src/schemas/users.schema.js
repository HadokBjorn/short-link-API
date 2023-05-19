import joi from "joi";
export const signupSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi
		.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } })
		.required(),
	password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
	confirmPassword: joi.ref("password"),
});

export const loginSchema = joi.object({
	email: joi
		.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } })
		.required(),
	password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
});
