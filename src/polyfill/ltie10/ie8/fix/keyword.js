
if (Promise) {
	Promise.prototype.catch_ = Promise.prototype["catch"];
}
if (Set) {
	Set.prototype.delete_ = Set.prototype["delete"];
}
if (Map) {
	Map.prototype.delete_ = Map.prototype["delete"];
}
if (WeakSet) {
	WeakSet.prototype.delete_ = WeakSet.prototype["delete"];
}
if (WeakMap) {
	WeakMap.prototype.delete_ = WeakMap.prototype["delete"];
}
