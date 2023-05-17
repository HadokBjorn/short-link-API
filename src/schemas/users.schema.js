import joi from "joi";
const signupSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } }),
	password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,15}$")).required(),
	confirmPassword: joi.ref("password"),
});
export default signupSchema;
