# vue2

对象依赖收集，数组依赖收集


组件 有多个属性
一个组件对应一个wacher；
一个属性对应一个dep，一个dep可以添加多个wacher

在get方法中收集依赖
在set方法中更新视图

dep 和 wacher 多对多

