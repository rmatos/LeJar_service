exports.NOT_YET_IMPLEMENTED_RESPONSE = {errorMessage: "Method not yet implemented"};

exports.MAINTENANCE_USERNAME = "maintenance";


//USER Module
exports.USER_CREATED_SUCCESSFULLY = {message : "User created successfully"};
exports.INVALID_FIRST_OR_LAST_NAME = {errorMessage: "First name and Last name must contain some value"};
exports.USER_ALREADY_FOUND_IN_DB = {errorMessage: "User was already found in the DB"};

//ENTRIES Module
exports.INVALID_USER_ID = {errorCode : 400, errorMessage: "Invalid user id to create entry"};
exports.INVALID_ENTRY_ID= {errorCode : 400, errorMessage: "Invalid entry id to update"};
exports.RECORD_ALREADY_CREATED = {errorCode: 400, errorMessage : "User already has an entry for today"};
exports.RECORD_CREATED_SUCCESSFULLY = {message : "Record created successfully"};
exports.RECORD_UPDATED_SUCCESSFULLY = {message : "Record updated successfully"};
exports.RECORD_REMOVED_SUCCESSFULLY = {message : "Record removed successfully"};

exports.ENTRY_TYPE_NORMAL = "normal";
exports.ENTRY_TYPE_MAINTENANCE = "maintenance";


