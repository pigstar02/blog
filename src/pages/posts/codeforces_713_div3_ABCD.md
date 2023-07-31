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
pubDate: 2021-04-13 16:26:14
tags:
- ACM
- ICPC
- 题解
theme: light
title: codeforces 713 div3 ABCD
---



## A.Spy Detected!

**题意**给你n个数，其中n-1个数相同，找到另一个不同的数，输出它的下标。

**思路**数据量很小直接扫一遍就好。

**代码**

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
int v[110],a[110];
void solve(){
	memset(v,0,sizeof v);
	int n,x;
	cin >> n;
	for(int i = 1; i <= n; i ++) {
		cin >> a[i];
		v[a[i]]++;
	}
	for(int i = 1; i <= n; i ++) {
		if(v[a[i]]==1) {
			printf("%d\n",i);
			break;
		}
	}
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
## B.Almost Rectangle
**题意**给你一个字符矩阵，其中有两个星号，其他都是点。将其中两个点改成星号，使四个星号位置构成一个矩形。

**思路**
- 若原本两个星号在同一行或同一列，则使另外两个星号的行或列加1，若超过n则使行列减1.
- 若原本两个星号在对角线位置，那么交换他们的x坐标即可。

**代码**

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
string s[410];
void solve(){
	int n;
	cin >> n;
	for(int i =1; i <= n; i ++) {
		cin >> s[i];
		s[i] = ' '+s[i];
	}
	int f = 0;
	int x[2],y[2];
	for(int i = 1; i <= n; i ++) {
		for(int j = 1; j <= n; j ++){
			if(s[i][j]=='*'){
				x[f] = i;
				y[f] = j;
				f++;
			}
		}
		if(f==2) break;
	}
	
	if(x[0]==x[1]) {
		int x2 = x[0]+1;
		if(x2 > n) x2-=2;
		s[x2][y[0]] = '*';
		s[x2][y[1]] = '*';
	}
	else if(y[0]==y[1]) {
		int y1 = y[0] + 1;
		if(y1>n) y1-=2;
		s[x[0]][y1] = '*';
		s[x[1]][y1] = '*';
	}
	else{
		s[x[0]][y[1]] = '*';
		s[x[1]][y[0]] = '*';
	}
	
	for(int i = 1; i <= n; i ++) {
		for(int j = 1; j <= n; j ++){
			printf("%c",s[i][j]);
		}
		puts("");
	}
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
## C.A-B Palindrome
**题意** 给你两个数a，b分别代表0，1的个数。再给你一个字符串（只包含0，1，？）问号可以是0也可以是1，但要满足回文且0的个数是a，1的个数是b。

**思路**
- 从头扫一遍，若对应位置为0和1则输出-1并且return
- 若一个是1或0，另一个是？则把问号改为相同数字
- 若两个都是问号，则记录下标（因为该位置可0可1，具体看最后0，1剩余数量）

然后处理两个都是问号的，看0，1剩余数量哪个大于等于2用哪个，若不够用输出-1.

**AC代码**

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
const int N = 4e5+10;
char s[N];
void solve(){
	int a, b, f = 1,t=0;
	cin >> a >> b;
	int n = a+b;
	cin >> s+1;
	vector<int> idx;
	for(int i = 1; i <= (n/2); i ++) {
		if(s[i] == '?'){
			if(s[n-i+1]!='?'){
				if(s[n-i+1]=='0') {
					a-=2;
					s[i] = '0';
				}
				else {
					b-=2;
					s[i] = '1';
				}
			}
			else{
				if(i<=(n/2)) idx.push_back(i);
			}
		}
		else
		{
			if(s[i]==s[n-i+1]){
				if(i<=(n/2)){
					if(s[i]=='0') a-=2;
					else b-=2;
				
				}
				
			}
			else{
				if(s[n-i+1] == '?'){
					if(s[i]=='0') {
						a-=2;
						s[n-i+1] = '0';
					}
					else {
						b-=2;
						s[n-i+1] = '1';
					}
				}
				else{
					f = 0;
					// puts("aaaa");
				}
			}
		}
	}
	if(!f) {
		puts("-1");
		return;
	}
	for(int i = 0; i < idx.size(); i ++){
		if(a >= 2){
			a-=2;
			s[idx[i]] = s[n-idx[i]+1] = '0';
		}
		else if(b >=2) {
			b-=2;
			s[idx[i]] = s[n-idx[i]+1] = '1';
		}
		else {
			f=0;
			// puts("bbb");
		}
	}
	if(a<0||b<0) f= 0;
	if(!f) {
		puts("-1");
		return;
	}
	
	if(a==1) {
		if(s[n/2+1]=='?')s[n/2+1] = '0';
		else if(s[n/2+1]=='1') f= 0;
	}
	else if(b==1){
		if(s[n/2+1]=='?')s[n/2+1] = '1';
		else if(s[n/2+1]=='0') f= 0;
	}
	
	if(!f) puts("-1");
	else{
		for(int i = 1; i <= n; i ++) printf("%c",s[i]);
		puts("");
	}
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
## D.Corrupted Array
**题意** 给你n+2个数，选出n个数的和为第n+1个数，还有一个数舍弃。如果不能找到输出-1。

**思路**
n最大为2e5，所以不能两层循环循环第n+1个数和舍弃的数。

首先我们求出所有数的和，然后减去舍弃的数（枚举哪个数舍弃），剩下的就是两倍的第n-1个数，我们只需把它除以2，看它是否存在。

**代码**

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
const int N = 2e5+10;
long long a[N];

void solve(){
	int n;
	cin >> n;
	n+=2;
	long long sum = 0;
	map<long long,int> mp1;
	for(int i = 1;i <= n; i ++) {
		cin >> a[i];
		mp1[a[i]]++;
		sum+=a[i];
	}
	sort(a+1,a+1+n);
	for(int i = 1; i <= n; i ++) {
		if((sum-a[i])%2) continue;
		else{
			long long temp = (sum-a[i])/2;
			mp1[a[i]]--;
			if(mp1[temp]){
				int t = 1;
				for(int j = 1; j <= n; j ++){
					if(j==i) continue;
					if(t&&a[j]==temp){
						t--;
						continue;
					}
					printf("%lld ",a[j]);
				}
				puts("");
				return;
			}
			mp1[a[i]]++;
		}
	}
	puts("-1");
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

