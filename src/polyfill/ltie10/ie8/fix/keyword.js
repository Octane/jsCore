
if ('function' == typeof Promise) {
    Promise.prototype.catch_ = Promise.prototype['catch'];
}
if ('function' == typeof Set) {
    Set.prototype.delete_ = Set.prototype['delete'];
}
if ('function' == typeof Map) {
    Map.prototype.delete_ = Map.prototype['delete'];
}
if ('function' == typeof WeakSet) {
    WeakSet.prototype.delete_ = WeakSet.prototype['delete'];
}
if ('function' == typeof WeakMap) {
    WeakMap.prototype.delete_ = WeakMap.prototype['delete'];
}
