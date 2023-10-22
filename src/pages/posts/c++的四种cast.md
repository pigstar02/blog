---
author: pigstar
cover:
  alt: cover
  square: https://raw.githubusercontent.com/pigstar02/blog_img/main/202307312301344.jpeg
  url: https://raw.githubusercontent.com/pigstar02/blog_img/main/202307312301344.jpeg
description: ''
keywords: cpp语法，cast
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: cpp语法，cast
  name: keywords
pubDate: 2023-10-21 11:32:07
tags: 
- cpp语法
- cast

theme: light
title: c++的四种cast
---

### static_cast
这里的静态是指只会静态检查，不会在运行时进行安全检查，所以要程序员自己保证转换的安全性。

### dynamic_cast
与static_cast相比，dynamic_cast主要用于基类和派生类之间的转换

基类是派生类的子集，派生类继承了基类的所有成员，包括数据成员和成员函数。

当进行向上转换（从派生类到基类）时，效果和static_cast差不多

当进行向下转化（从基类到派生类）时，会检查转化后的完整性，因为派生类除了包含基类中的成员，还有一些自己独有的成员。

如果转换失败会返回空指针或bad_cast 异常

### reinterpret_cast
reinterpret_cast不会进行任何检查，它只是用不同的角度对同一串二进制进行解释。

reinterpret_cast相当于把其中一个结构体内存上的二进制复制到另一个结构体的内存位置，就算两个结构体大小相同，我们知道不同结构体由于结构体对齐原则会有不同的结构，所以原先表示int的4个字节可能会被截断，所以要程序员自己保证转换的安全性。

### const_cast
顾名思义，是去掉变量中的const属性，但是如果真的对转换后的变量进行写操作会发生ub。

所以主要作用是为了匹配上对应的函数签名，然后进行只读操作

```cpp
#include <iostream>
using namespace std;

void print (char * str)
{
  cout << str << '\n';
}

int main () {
  const char * c = "sample text";
  print ( const_cast<char *> (c) );
  return 0;
}
```




