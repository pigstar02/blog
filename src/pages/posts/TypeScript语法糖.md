---
author: pigstar
title: TypeScript语法糖
pubDate: 2025-07-25 10:09:19
description: "[请填写文章的简短描述]"
cover:
  alt: TypeScript语法糖
  square: "[请粘贴方形封面图片URL]"
  url: "[请粘贴主封面图片URL]"
tags:
  - TypeScript
theme: light
layout: ../../layouts/MarkdownPost.astro
keywords: "[关键词1, 关键词2, 关键词3]"
meta:
  - name: author
    content: pigstar
  - name: keywords
    content: "[关键词1, 关键词2, 关键词3]"
---
TypeScript 提供了许多语法糖，旨在简化代码编写、提高可读性并减少样板代码。以下是一些常见的 TypeScript 语法糖，按类别划分并附带代码示例：

### 1. 属性访问与解构

#### a. 属性访问（Property Access）

虽然不是严格意义上的“语法糖”，但 TypeScript 的类型系统允许你在编译时检查属性访问，这在一定程度上提供了更安全的“语法糖”。

#### b. 对象解构（Object Destructuring）

允许你从对象中提取属性，并将其作为独立的变量使用。

**示例：**

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// 传统方式
const userId = user.id;
const userName = user.name;

// 使用对象解构
const { id, name, email } = user;
console.log(id, name, email); // 输出: 1 Alice alice@example.com

// 解构时重命名变量
const { id: userIdAlias, name: userNameAlias } = user;
console.log(userIdAlias, userNameAlias); // 输出: 1 Alice

// 解构时设置默认值
const { id: userIdWithDefault, age = 30 } = user; // user 没有 age 属性
console.log(userIdWithDefault, age); // 输出: 1 30
```

#### c. 数组解构（Array Destructuring）

允许你从数组中提取元素，并将其作为独立的变量使用。

**示例：**

```typescript
const numbers = [1, 2, 3, 4, 5];

// 传统方式
const first = numbers[0];
const second = numbers[1];

// 使用数组解构
const [firstNum, secondNum, ...rest] = numbers;
console.log(firstNum, secondNum, rest); // 输出: 1 2 [ 3, 4, 5 ]

// 跳过某些元素
const [, , thirdNum] = numbers;
console.log(thirdNum); // 输出: 3

// 交换变量
let a = 10;
let b = 20;
[a, b] = [b, a];
console.log(a, b); // 输出: 20 10
```

### 2. 函数与箭头函数

#### a. 箭头函数（Arrow Functions）

提供了一种更简洁的函数表达式语法，并且具有词法作用域的 `this`。

**示例：**

```typescript
// 传统函数表达式
const addTraditional = function(x: number, y: number): number {
  return x + y;
};

// 箭头函数
const addArrow = (x: number, y: number): number => x + y;

console.log(addArrow(5, 3)); // 输出: 8

// 带有多个语句的箭头函数
const greet = (name: string): string => {
  const message = `Hello, ${name}!`;
  return message;
};

console.log(greet("Bob")); // 输出: Hello, Bob!

// 箭头函数中的 this 绑定
class Counter {
  count = 0;

  // 传统方式，需要使用 bind 或 self
  incrementTraditional() {
    setTimeout(function() {
      // this 指向 undefined (在严格模式下) 或 window
      // console.log(this.count); // 错误
    }.bind(this), 1000);
  }

  // 使用箭头函数，this 自动绑定到类的实例
  incrementArrow() {
    setTimeout(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
}

const counter = new Counter();
counter.incrementArrow(); // 1秒后输出: 1
```

### 3. 类（Classes）

#### a. 参数属性（Parameter Properties）

允许你在类的构造函数参数中直接声明访问修饰符（`public`, `private`, `protected`, `readonly`），TypeScript 会自动将这些参数转换为类的成员属性。

**示例：**

```typescript
class Person {
  // 传统方式
  // public name: string;
  // private age: number;
  // constructor(name: string, age: number) {
  //   this.name = name;
  //   this.age = age;
  // }

  // 使用参数属性
  constructor(public name: string, private readonly age: number) {}

  getAge(): number {
    return this.age;
  }
}

const person = new Person("Charlie", 25);
console.log(person.name); // 输出: Charlie
// console.log(person.age); // 错误: Property 'age' is private and only accessible within class 'Person'.
console.log(person.getAge()); // 输出: 25
```

#### b. 访问修饰符（Access Modifiers）

`public`, `private`, `protected`, `readonly` 允许你控制类成员的可访问性。

**示例：**

```typescript
class Animal {
  public species: string; // 公共属性，可以在任何地方访问
  private name: string;   // 私有属性，只能在类内部访问
  protected age: number;  // 受保护属性，可以在类内部及其子类中访问

  constructor(species: string, name: string, age: number) {
    this.species = species;
    this.name = name;
    this.age = age;
  }

  public makeSound(): void {
    console.log("Generic sound");
  }

  private getName(): string {
    return this.name;
  }

  protected getAge(): number {
    return this.age;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super("Canine", name, age);
  }

  bark(): void {
    console.log("Woof!");
    // 可以访问受保护的 age 属性
    console.log(`My age is ${this.age}`);
    // 不能访问私有的 name 属性
    // console.log(this.name); // 错误
  }

  // 可以调用父类的公共方法
  callParentSound(): void {
    this.makeSound();
  }
}

const myDog = new Dog("Buddy", 3);
console.log(myDog.species); // 输出: Canine
myDog.bark(); // 输出: Woof! \n My age is 3
myDog.callParentSound(); // 输出: Generic sound
// console.log(myDog.name); // 错误: Property 'name' is private
// console.log(myDog.age);  // 错误: Property 'age' is protected
```

### 4. 类型注解与推断

#### a. 类型推断（Type Inference）

TypeScript 会自动推断变量、函数参数和返回值的类型，通常不需要显式注解。

**示例：**

```typescript
let message = "Hello, world!"; // TypeScript 推断 message 的类型为 string
// message = 123; // 错误: Type 'number' is not assignable to type 'string'.

const numbersArray = [1, 2, 3]; // TypeScript 推断 numbersArray 的类型为 number[]
// numbersArray.push("a"); // 错误: Argument of type 'string' is not assignable to parameter of type 'number'.

function multiply(a: number, b: number) {
  return a * b; // TypeScript 推断返回类型为 number
}
```

#### b. 类型断言（Type Assertion）

允许你告诉 TypeScript 编译器，你比它更了解某个值的类型。有两种形式：`as` 关键字和尖括号 `<>`。

**示例：**

```typescript
// 假设我们从 DOM 获取一个元素，但 TypeScript 不确定其具体类型
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// 或者
// const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");

if (myCanvas) {
  myCanvas.getContext("2d"); // 现在可以安全地调用 getContext 方法
}

// 另一种场景：将 any 类型断言为特定类型
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
// 或者
// let strLength: number = (<string>someValue).length;
```

### 5. 模块与命名空间

#### a. 模块（Modules）

使用 `import` 和 `export` 关键字来组织代码，避免全局命名空间污染。

**示例：**

**`math.ts`**
```typescript
export const PI = 3.14159;

export function add(x: number, y: number): number {
  return x + y;
}

export class Circle {
  constructor(public radius: number) {}
  getArea(): number {
    return PI * this.radius * this.radius;
  }
}
```

**`main.ts`**
```typescript
import { PI, add, Circle } from "./math"; // 导入 math.ts 中的内容

console.log(PI); // 输出: 3.14159
console.log(add(5, 3)); // 输出: 8

const myCircle = new Circle(10);
console.log(myCircle.getArea()); // 输出: 314.159
```

#### b. 命名空间（Namespaces）

在早期 TypeScript 中用于组织代码，现在更推荐使用 ES 模块。

**示例：**

```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}

// 使用命名空间
const validator = new Validation.LettersOnlyValidator();
console.log(validator.isAcceptable("Hello")); // 输出: true
console.log(validator.isAcceptable("123"));   // 输出: false
```

### 6. 字符串模板（Template Literals）

允许嵌入表达式和多行字符串，比传统的字符串拼接更方便。

**示例：**

```typescript
interface Product {
  name: string;
  price: number;
}

const product: Product = { name: "Laptop", price: 1200 };

// 传统字符串拼接
const messageTraditional = "Product: " + product.name + ", Price: $" + product.price;

// 使用字符串模板
const messageTemplate = `Product: ${product.name}, Price: $${product.price}`;
console.log(messageTemplate); // 输出: Product: Laptop, Price: $1200

// 多行字符串
const multiLine = `
  This is a
  multi-line string
  with embedded values: ${product.name}.
`;
console.log(multiLine);
```

### 7. 可选链（Optional Chaining） `?.`

允许安全地访问嵌套对象属性，如果中间属性为 `null` 或 `undefined`，则表达式会短路并返回 `undefined`，而不是抛出错误。

**示例：**

```typescript
interface Address {
  street?: string;
  city?: string;
}

interface PersonWithAddress {
  name: string;
  address?: Address;
}

const person1: PersonWithAddress = {
  name: "David"
};

const person2: PersonWithAddress = {
  name: "Eve",
  address: {
    street: "123 Main St"
  }
};

// 传统方式，需要多层检查
const street1 = person1.address ? person1.address.street : undefined;
console.log(street1); // 输出: undefined

// 使用可选链
const street2 = person1.address?.street;
console.log(street2); // 输出: undefined

const street3 = person2.address?.street;
console.log(street3); // 输出: 123 Main St

// 链式访问
const city2 = person2.address?.city;
console.log(city2); // 输出: undefined

// 可选链与函数调用
interface UserProfile {
  name: string;
  getDetails?: () => string;
}

const user1: UserProfile = { name: "Frank" };
const user2: UserProfile = { name: "Grace", getDetails: () => "Details for Grace" };

const details1 = user1.getDetails?.(); // 如果 getDetails 不存在，则返回 undefined
console.log(details1); // 输出: undefined

const details2 = user2.getDetails?.();
console.log(details2); // 输出: Details for Grace
```

### 8. 空值合并运算符（Nullish Coalescing Operator） `??`

当左侧操作数为 `null` 或 `undefined` 时，返回右侧操作数；否则返回左侧操作数。这与逻辑或运算符 `||` 不同，`||` 会在左侧操作数为假值（如 `0`, `""`, `false`）时也返回右侧操作数。

**示例：**

```typescript
let firstName: string | null = null;
let lastName: string = "Smith";

// 使用 || (如果 firstName 是空字符串或 0，也会使用 lastName)
const fullNameOr = firstName || lastName;
console.log(fullNameOr); // 输出: Smith

// 使用 ?? (只有当 firstName 是 null 或 undefined 时才使用 lastName)
const fullNameNullish = firstName ?? lastName;
console.log(fullNameNullish); // 输出: Smith

let count: number | undefined = 0;
const displayCountOr = count || "N/A"; // count 是 0，被认为是假值
console.log(displayCountOr); // 输出: N/A

const displayCountNullish = count ?? "N/A"; // count 是 0，不是 null 或 undefined
console.log(displayCountNullish); // 输出: 0
```

### 9. 扩展运算符（Spread Operator） `...`

用于展开可迭代对象（如数组、字符串）或对象属性。

**示例：**

#### a. 数组扩展

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const combinedArray = [...arr1, ...arr2];
console.log(combinedArray); // 输出: [ 1, 2, 3, 4, 5, 6 ]

// 复制数组
const copiedArray = [...arr1];
console.log(copiedArray); // 输出: [ 1, 2, 3 ]

// 在函数调用中传递数组元素
function sum(a: number, b: number, c: number) {
  return a + b + c;
}
console.log(sum(...arr1)); // 输出: 6
```

#### b. 对象扩展

```typescript
interface PersonInfo {
  name: string;
  age: number;
}

interface ContactInfo {
  email: string;
  phone?: string;
}

const personData: PersonInfo = { name: "Hannah", age: 30 };
const contactData: ContactInfo = { email: "hannah@example.com", phone: "123-456-7890" };

// 合并对象
const completeInfo = { ...personData, ...contactData };
console.log(completeInfo);
// 输出: { name: 'Hannah', age: 30, email: 'hannah@example.com', phone: '123-456-7890' }

// 覆盖属性
const updatedPerson = { ...personData, age: 31 };
console.log(updatedPerson); // 输出: { name: 'Hannah', age: 31 }
```

### 10. 装饰器（Decorators）

装饰器是一种特殊的声明，可以附加到类声明、方法、访问器、属性或参数上。它们是一种元编程的语法糖，允许你修改类或其成员的行为。

**示例（需要启用实验性装饰器支持）：**

在 `tsconfig.json` 中设置 `"experimentalDecorators": true`。

```typescript
// 方法装饰器示例
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // 保存原始方法

  descriptor.value = function(...args: any[]) {
    console.log(`Calling method "${propertyKey}" with arguments:`, args);
    const result = originalMethod.apply(this, args); // 调用原始方法
    console.log(`Method "${propertyKey}" returned:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @logMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(10, 5);
// 输出:
// Calling method "add" with arguments: [ 10, 5 ]
// Method "add" returned: 15
```

### Number方法