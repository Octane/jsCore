
if (typeof Promise == "function") {
    Promise.prototype.catch_ = Promise.prototype["catch"];
}
if (typeof Set == "function") {
    Set.prototype.delete_ = Set.prototype["delete"];
}
if (typeof Map == "function") {
    Map.prototype.delete_ = Map.prototype["delete"];
}
if (typeof WeakSet == "function") {
    WeakSet.prototype.delete_ = WeakSet.prototype["delete"];
}
if (typeof WeakMap == "function") {
    WeakMap.prototype.delete_ = WeakMap.prototype["delete"];
}
