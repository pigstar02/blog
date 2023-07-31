---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
description: ''
keywords: key1, key2, key3
layout: ../../layouts/MarkdownPost.astro
meta:
- content: pigstar
  name: author
- content: key3, key4
  name: keywords
pubDate: 2021-04-04 16:55:28
tags:
- ACM
- ICPC
- 题解
theme: light
title: codeforces 712 div2 ABC
---



# codeforces 712 div2 ABC

## A. Déjà Vu



A palindrome is a string that reads the same backward as forward. For example, the strings "z", "aaa", "aba", and "abccba" are palindromes, but "codeforces" and "ab" are not. You hate palindromes because they give you déjà vu.

There is a string 𝑠. You must insert exactly one character 'a' somewhere in 𝑠. If it is possible to create a string that is not a palindrome, you should find one example. Otherwise, you should report that it is impossible.

For example, suppose 𝑠="cbabc". By inserting an 'a', you can create "acbabc", "cababc", "cbaabc", "cbabac", or "cbabca". However "cbaabc" is a palindrome, so you must output one of the other options.


**Input**

The first line contains a single integer 𝑡 (1≤𝑡≤104) — the number of test cases.

The only line of each test case contains a string 𝑠 consisting of lowercase English letters.

The total length of all strings does not exceed 3e5.


**Output**

For each test case, if there is no solution, output "NO".

Otherwise, output "YES" followed by your constructed string of length |𝑠|+1 on the next line. If there are multiple solutions, you may print any.

You can print each letter of "YES" and "NO" in any case (upper or lower).


**样例输入**
```bash
6
cbabc
ab
zza
ba
a
nutforajaroftuna
```

**样例输出**

```bash
YES
cbabac
YES
aab
YES
zaza
YES
baa
NO
YES
nutforajarofatuna
```

**Note**
The first test case is described in the statement.

In the second test case, we can make either "aab" or "aba". But "aba" is a palindrome, so "aab" is the only correct answer.

In the third test case, "zaza" and "zzaa" are correct answers, but not "azza".

In the fourth test case, "baa" is the only correct answer.

In the fifth test case, we can only make "aa", which is a palindrome. So the answer is "NO".

In the sixth test case, "anutforajaroftuna" is a palindrome, but inserting 'a' elsewhere is valid.

### 大概题意
给你一个字符串，让你在某个位置加上一个a，如果能使其变成一个非回文的字符串，则输出YES，并将结果字符串输出；否则就输出NO。

### 思路
显然若原字符串中有非a字母，那么我们只需将a添加在其对应位置即可构造。也就是说若原字符串只有a，则不能构造，输出NO。

### AC代码

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e5;

void solve(){
	string s;
	cin >> s;
	int len = s.length();
	int temp = -1;
	//寻找非a字母的位置
	for(int i = 0; i < len; i ++){
		if(s[i]!='a'){
			temp = i;
			break;
		}
	}
	//temp=-1 就是没找到
	if(temp==-1){
		printf("NO\n");
		return;
	}
	printf("YES\n");
	if(len - temp <= temp) {//对应位置在temp前面
		for(int i = 0; i < len-temp-1; i ++) printf("%c",s[i]);
		printf("a");
		for(int i = len-temp-1; i < len; i ++) printf("%c",s[i]);
	}
	else{//对应位置在temp后面
		for(int i = 0; i < len-temp; i ++) printf("%c",s[i]);
		printf("a");
		for(int i = len-temp; i < len; i ++) printf("%c",s[i]);
	}
	
	puts("");
	return;
}
int main(){
	int T;
	cin >> T;
	while (T--){
		solve();
	}
	return 0;
}
```

---
## B.Flip the Bits

There is a binary string 𝑎 of length 𝑛. In one operation, you can select any prefix of 𝑎 with an equal number of 0 and 1 symbols. Then all symbols in the prefix are inverted: each 0 becomes 1 and each 1 becomes 0



For example, suppose 𝑎=0111010000



 - In the first operation, we can select the prefix of length 8 since it has four 0's and four 1's: [01110100]00→[10001011]00

- In the second operation, we can select the prefix of length 2
since it has one 0 and one 1: [10]00101100→[01]00101100

- It is illegal to select the prefix of length 4
for the third operation, because it has three 0's and one 1

Can you transform the string 𝑎 into the string 𝑏 using some finite number of operations (possibly, none)?

### Input
The first line contains a single integer 𝑡 (1≤𝑡≤1e4) — the number of test cases.

The first line of each test case contains a single integer 𝑛(1≤𝑛≤3e5) — the length of the strings 𝑎 and 𝑏

The following two lines contain strings 𝑎 and 𝑏 of length 𝑛, consisting of symbols 0 and 1

The sum of 𝑛 across all test cases does not exceed 3e5.

### Output
For each test case, output "YES" if it is possible to transform 𝑎 into 𝑏, or "NO" if it is impossible. You can print each letter in any case (upper or lower).

**样例输入**
```bash
5
10
0111010000
0100101100
4
0000
0000
3
001
000
12
010101010101
100110011010
6
000111
110100
```

**样例输出**

```bash
YES
YES
NO
YES
NO
```

### Note

The first test case is shown in the statement.

In the second test case, we transform 𝑎 into 𝑏 by using zero operations.

In the third test case, there is no legal operation, so it is impossible to transform 𝑎
into 𝑏.

In the fourth test case, here is one such transformation:

- Select the length 2 prefix to get 100101010101.
- Select the length 12 prefix to get 011010101010.
- Select the length 8 prefix to get 100101011010.
- Select the length 4 prefix to get 011001011010.
- Select the length 6 prefix to get 100110011010.

In the fifth test case, the only legal operation is to transform 𝑎 into 111000. From there, the only legal operation is to return to the string we started with, so we cannot transform 𝑎 into 𝑏.

### 大概题意
给你两个01字符串，要求你通过一些操作使其中一个变成另外一个。

操作要求 
 - 选择任意长度的前缀，使其中的0变1，1变0.
 - 这个前缀中的0，1数量相同。

最后能变换成一样的输出YES，否则NO。


### 思路
需要清楚的一点是，假设任意长度前缀里的0，1数量为x，y，若干次变换后，该前缀中0，1数量要么是x，y；要么是y，x。**若初始时0，1数量一样，不管几次变换后还是一样。**

因为较长前缀会影响较短前缀，所以我们从后往前，前缀长度由长到短操作，保证相等的后缀长度越来越长。

### AC代码

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 3e5 + 10;
int a0[N],a1[N],p[N]; //a0是前缀出现0次数,a1是前缀出现1次数,p是1说明当前位置不同
void solve(){
	int n;
	cin >> n;
	string a,b;
	cin >> a >> b;
	//使字符串从1开始
	a = ' '+a;
	b = ' '+b;
	//初始化
	for(int i = 0; i <= n; i ++){
		a0[i] = 0;
		a1[i] = 0;
	}
	for(int i = 1; i <= n; i ++){
		//维护前缀0，1数量
		if(a[i] == '0'){
			a0[i] = a0[i-1]+1;
			a1[i] = a1[i-1];
		}
		else {
			a1[i] = a1[i-1] +1;
			a0[i] = a0[i-1];
		}
		//标记需要变换的位置
		if(a[i] != b[i]) p[i] = 1;
		else p[i] = 0;
	}
	
	
	int op = 0;//已操作次数
	int f = 0;//标记是否失败
	for(int i = n; i >= 1; i --){
		if(op%2){//奇数次操作说明此位置与初始值相反
			p[i] = 1-p[i];
		}
		
		if(p[i]){ //两字符串此位置不同
			if(a0[i] == a1[i]){ //若满足前缀0，1数量一样
				op++;
			}
			else{//失败输出NO
				f = 1;
				break;
			}
		}
	}
	if(!f) printf("YES\n");
	else printf("NO\n");
}
int main(){
	int T;
	cin >> T;
	while (T--){
		solve();
	}
	return 0;
}
```

---
 ## C. Balance the Bits

A sequence of brackets is called balanced if one can turn it into a valid math expression by adding characters '+' and '1'. For example, sequences '(())()', '()', and '(()(()))' are balanced, while ')(', '(()', and '(()))(' are not.

You are given a binary string 𝑠 of length 𝑛. Construct two balanced bracket sequences 𝑎 and 𝑏 of length 𝑛 such that for all 1≤𝑖≤𝑛:
- if 𝑠𝑖=1, then 𝑎𝑖=𝑏𝑖
- if 𝑠𝑖=0, then 𝑎𝑖≠𝑏𝑖

If it is impossible, you should report about it.

### Input

The first line contains a single integer 𝑡 (1≤𝑡≤1e4) — the number of test cases.

The first line of each test case contains a single integer 𝑛(2≤𝑛≤2e5, 𝑛 is even).

The next line contains a string 𝑠 of length 𝑛, consisting of characters 0 and 1.

The sum of 𝑛 across all test cases does not exceed 2e5.

### Output
If such two balanced bracked sequences exist, output "YES" on the first line, otherwise output "NO". You can print each letter in any case (upper or lower).

If the answer is "YES", output the balanced bracket sequences 𝑎
and 𝑏 satisfying the conditions on the next two lines.

If there are multiple solutions, you may print any.

**样例输入**
```bash
3
6
101101
10
1001101101
4
1100
```

**样例输出**

```bash
YES
()()()
((()))
YES
()()((()))
(())()()()
NO
```

### Note
In the first test case, 𝑎="()()()" and 𝑏="((()))". The characters are equal in positions 1, 3, 4, and 6, which are the exact same positions where 𝑠𝑖=1.

In the second test case, 𝑎="()()((()))" and 𝑏="(())()()()". The characters are equal in positions 1, 4, 5, 7, 8, 10, which are the exact same positions where 𝑠𝑖=1.

In the third test case, there is no solution.

### 大概题意
给你一个0，1串和它的长度n，请你构造两个长度为n不同的合法的（就是满足任意前缀左括号数量大于等于右括号，最后是相等）只包含‘（’  ，‘）’的字符串，可以构造输出YES，并输出任意一种情况，不能则输出NO。

### 思路
**不可行条件**
首先字符串第一个一定是‘（ ’ ，最后一个一定是‘ ）’ 。也就是说这两个位置必定相同，所以s[1]和s[n]一定为1.

其次，0的数量一定是偶数，又因为题目给定n一定是偶数，所以1的数量也一定是偶数。

**证明：**  假设1提供的左括号和右括号数量分别为a，b。若0的数量为奇数，其中对于第一个串是左括号的有x个，是右括号的有y个，那么对于第二个串则相反。最终
- 第一个串左括号a+x个，右括号b+y个。
- 第二个串左括号a+y个，右括号b+x个。

显然，因为x，y是自然数，且0的数量是奇数（无法拆成两个相同的数相加），所以，x不等于y，则两个串必有一个不合法。

---
**可行构造**
- 设1的个数是o，让前o/2个1为左括号，后o/2个1为右括号

- 设0的个数为z，让第一个串‘（ ‘和’ ）‘交替选择；第二个串’ ）‘和’ （ ‘交替选择。
### AC代码

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e5;
int a[N], b[N];

void solve(){
	int n;
	cin >> n;
	string s;
	cin >> s;
	s = ' '+s;
	int o = 0;
	//统计1的数量
	for(int i = 1; i <= n; i ++) {
		if (s[i] == '1') o++;
	}
	//判断可不可行
	if(s[1]=='0' || s[n]=='0' || o%2){
		printf("NO\n");
		return;
	}
	
	//可行
	int d = 0,f = 0;//d是1当前出现次数
	string x, y;
	for(int i = 1; i <= n; i ++){
		if(s[i] == '1'){
			if (d < o/2){//前半部分1
				x+='(';
				y+='(';
			}
			else{//后半部分1
				x+=')';
				y+=')';
			}
			d++;
		}
		else{
			x+="()"[f];
			y+=")("[f];
			f=1-f;//f在0，1反复变换
		}
	}
	printf("YES\n");
	cout << x <<'\n'<<y<<'\n';
	return;
}
int main(){
	int T;
	cin >> T;
	while (T--){
		solve();
	}
	return 0;
}
```

