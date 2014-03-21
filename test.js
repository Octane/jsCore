console.clear();

var b = document.body, cl1 = b.classList, cl2 = b.classList;
cl1.add("c1");
cl2.add("c2");
console.log(b.className);
console.log(JSON.stringify(cl1));
console.log(JSON.stringify(cl2));
cl1.toggle("c2");
cl2.toggle("c1")
var cl3 = b.classList;
cl3.add("c3", "c4");
console.log(b.className);
console.log(JSON.stringify(cl1));
console.log(JSON.stringify(cl2));
console.log(JSON.stringify(cl3));
