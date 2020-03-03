// 创建父构造函数
function SuperClass(name){
  this.name = name;
  this.showName = function(){
    alert(this.name);
  }
}
// 设置父构造器的原型对象
SuperClass.prototype.showAge = function(){
  console.log(this.age);
}
// 创建子构造函数
function SubClass(){

}
// 设置子构造函数的原型对象实现继承
SubClass.prototype = SuperClass.prototype;
var child = new SubClass()
