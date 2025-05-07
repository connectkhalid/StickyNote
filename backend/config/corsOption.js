const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
      origins: (origin, callback) => {
            if(allowedOrigins.indexOf(origin) != -1 ||!origin){
            // Allow the request if origin is in the allowedOrigins array or if there is no origin (e.g., when the request is made from a non-browser client like Postman)
                  callback(null, true); 
            }
            else{
                  callback(new Error('Not allowed by CORS')); // Reject the request if origin is not in the allowedOrigins array
            }
      },
            Credential: true, // Allow credentials (cookies, authorization headers, or TLS client certificates) to be included in cross-origin requests
            optionSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204, so we set it to 200
}

module.exports = corsOptions;