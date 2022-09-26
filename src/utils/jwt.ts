import { AuthorizationTokenPayload } from "./../types";
import jwt = require("jsonwebtoken");

const validateToken = (accessToken: string | undefined): Promise<AuthorizationTokenPayload> =>
	new Promise((resolve, reject) => {
		if (!accessToken) return reject({ message: "You are not authorized!" });
		else {
			jwt.verify(accessToken, "abcdefg123456", { algorithms: ["HS256"] }, (err, decoded: AuthorizationTokenPayload) => {
				if (err) return reject({ message: "You are not authorized" });
				else return resolve(decoded);
			});
		}
	});

export { validateToken };
