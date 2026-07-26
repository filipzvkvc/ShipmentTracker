export function validateEmailPassword( argEmail, password){
    if( argEmail.length === 0 || password.length === 0) return { validationError: "Email and password fields are mandatory" }

    return { validationError : null};
}