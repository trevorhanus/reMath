"use strict";
var uuid_1 = require("uuid");
var replaceDashRegex = /-/g;
function genId() {
    var uuid = uuid_1.v4();
    var remathId = 'id' + uuid.replace(replaceDashRegex, '');
    return remathId;
}
exports.genId = genId;
//# sourceMappingURL=id.js.map