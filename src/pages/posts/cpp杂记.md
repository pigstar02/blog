---
author: pigstar
cover:
  alt: cover
  square: https://cdn.jsdelivr.net/gh/pigstar02/blog_img@main/2023 10 21 12 08 38.jpg
  url: https://cdn.jsdelivr.net/gh/pigstar02/blog_img@main/2023 10 21 12 08 38.jpg
description: ''
keywords: cpp，虚函数，多态
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: cpp，虚函数，多态
  name: keywords
pubDate: 2023-10-21 09:48:09
tags: 
- cpp
- 虚函数
- 多态

theme: light
title: cpp杂记
---

## 调用虚函数时默认参数值是如何寻找的，是通过指针类型还是实际的对象类型
**虚函数的默认参数值是静态绑定的**

也就是说，它是由指针或引用的静态类型决定的，而不是由实际对象的类型决定的。这意味着如果你有一个基类指针指向一个派生类对象，并且通过这个指针调用了一个虚函数，那么该虚函数的默认参数值将是基类中定义的值，而不是派生类中定义的值

这种设计主要是出于运行效率的考虑。如果默认参数被动态绑定，那么在运行时就需要类似于查找虚函数表的机制来确定默认参数，这将比在编译阶段确定默认参数值的机制更慢、更复杂。

**例子**
```cpp
#include <iostream>

class Base {
public:
    virtual void foo(int x = 5) {
        std::cout << "Base::foo(" << x << ")" << std::endl;
    }
};

class Derived : public Base {
public:
    void foo(int x = 10) override {
        std::cout << "Derived::foo(" << x << ")" << std::endl;
    }
};

int main() {
    Base* ptr = new Derived;

    ptr->foo(); // 调用的是 Derived::foo()，使用默认参数 5
    delete ptr;

    return 0;
}
```

输出

```shell
Derived::foo(5)
```

## 结构体的内存对齐
首先找到所有成员变量中最大的成员变量，比如说是int，那就是4个字节，接下来我们把内存看作4个字节一行，编号从0到3，如图显示

![](https://cdn.jsdelivr.net/gh/pigstar02/blog_img@main/2023-10-21-13-16-14.png)

每个成员会按照定义顺序分布内存，然后从左往右，从上往下找到第一个下标idx，满足idx%siz==0，siz是成员变量的大小

比如我有如下结构体，则它的内存分布如图

```cpp
struct node {
    char c;
    short b;
    int a;
};
```

![](https://cdn.jsdelivr.net/gh/pigstar02/blog_img@main/2023-10-21-13-22-42.png)

最后结构体的大小是每行的字节乘以使用的行数，不满也算，所以总是最大成员变量的倍数

## 关键词friend 友元

只是在类里面声明了一下权限（友元不是类的成员，不受public，private等约束），必须在友元之外再专门对函数进行一次声明。
```cpp
class Box {
    double width;
public:
    friend void printWidth(Box box);
    friend class Circle;
};

```

友元函数能访问类里面所有成员包括私有成员，友元类里的所有成员函数能访问类里面所有成员包括私有成员。

总的来说，友元提供了一种有效的方式来增强类的封装性和灵活性，但同时也可能破坏数据的封装和隐藏。因此，在使用时需要谨慎对待。

## 注意迭代器的失效时间
```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
for (auto it = numbers.begin(); it != numbers.end(); ++it) {
    if (*it % 2 == 0) {
        numbers.erase(it);  // 删除偶数元素
    }
}
```

```cpp
std::vector<int> vec;
for (int i = 0; i < 5; ++i) {
    vec.push_back(i);
}
auto it = vec.begin();
vec.clear();
*it = 10;  // 迭代器指向已清空的容器，导致未定义行为
```

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
auto it = numbers.begin();
// ...
numbers.push_back(6);  // 容器大小可能发生变化（发生扩容）
*it = 10;  // 使用过期的迭代器
```
