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
pubDate: 2021-04-14 13:07:58
tags:
- ACM
- ICPC
- 题解
theme: light
title: codeforces div2 714 ABC
---



## A. Array and Peaks

**题意**给你n，k；输出一个长度为n，包含k个峰的序列（1至n每个数字只出现一次），不存在输出-1.

**思路**
 - 首先长度为n的序列最多有(n-1)/2个峰，如果k>(n-1)/2那么输出-1。

1. 其余的在i的位置（i%2==0&&1=<i<=n）依次放置最大值。再在空白的位置从小到大依次排放没使用过的数字。
2. 或者在原本1到n有序的序列上交换第i个和第i+1个（i%2==0&&1=<i<=n）

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
int a[N];
void solve(){
	int n, k;
	cin >> n >> k;
	
	if(k>(n-1)/2) {
		puts("-1");
		return;
	}
	for(int i = 1; i <= n; i ++) a[i] = i;
	int idx = 2;
	while(k--){
		swap(a[idx],a[idx+1]);
		idx+=2;
	}
	for(int i = 1; i <= n; i ++) printf("%d ",a[i]);
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
## B.AND Sequences
**题意**给你n个数，将其全排列，其中满足𝑎1&𝑎2&…&𝑎𝑖=𝑎𝑖+1&𝑎𝑖+2&…&𝑎𝑛,（1<=i<n）的有多少种。

**思路**
- 如果满足题目要求的必定满足x = a1&a2&...&a(k-1)&a(k+1)&...&an。再在等式两边&上x。此时排列为 **x（中间有n-2个数）x**那么右边就是n个数&起来，这是恒定的，计作sum。
- 然后找数列中有几个数等于sum，也就是x的个数,计作cnt。因为x要在排列首尾各放一个，当x的个数小于2时才存在答案。
- 答案=A(n-2,n-2){中间排列的种数} ✖️ A(2,cnt){首尾放置的种数}
- 注意当ai==aj但i != j时两个元素不能视为相同

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
typedef long long ll;
const ll N = 200010, mod = 1e9 + 7;
ll a[N];
ll p[N];
int main() {
  p[0] = p[1] = 1;
  for (int i = 2; i <= 200010; i++) p[i] = (p[i - 1] * i) % mod;
  int T;
  cin >> T;
  while (T--) {
    ll n;
    cin >> n;
    ll sum = (1<<31)-1;
    for (int i = 1; i <= n; i++) {
      scanf("%lld", &a[i]);
      sum &= a[i];
    }
    ll cnt = 0;
    for (int i = 1; i <= n; i++)
      if (a[i] == sum) cnt++;

    ll ans;
    if (cnt < 2) {
      ans = 0;
    }
    else{
      ans = cnt*(cnt-1)%mod;
      ans = (ans*p[n-2])%mod;
    }
    
    printf("%lld\n", ans);
  }
  return 0;
}
```
---
## C. Add One
**题意**给你一个数字，要求对它进行m次操作，每次操作对每一位数字加1。求m次操作后数字的位数（长度）

**思路**
- 首先明确每个数字的操作是独立的就是说123 操作m次可以看做1操作m次，2操作m次，3操作m次，最后把他们操作m次后各自的长度加起来就是123操作m次的长度。
- 记f（n，m）为对n操作m次的长度   
   则有f（10，m）= f（1，m）+ f（0，m）=f（10，m-9）+f（10，m-10）
   所以可以预处理出对10操作m次的后长度的数组
- 然后只需要对原数字的每一位处理就好

**这题卡常数，得用scanf，因为这个wa了好久0.0**

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
const int mod = 1e9+7;
long long a[15];
long long b[N];

void init(){
	for(int i = 0; i <= 8; i ++) b[i] = 2;
	b[9]=3;
	for(int i = 10; i <=200005;i++) b[i] = (b[i-9]+b[i-10])%mod;
	
} 
void solve(long long m,long long n){
	for(int i = 0; i <=9;i ++) a[i] = 0;//刚开始每个数字个数0
	long long ans = 0;
	if(n==0) {//0的长度为1
		a[0]++;
	}
	while(n){
		a[n%10]++;
		n/=10;
	}
	
	
	for(int i = 0; i <=9; i ++){//遍历每个数字
		long long x;
		if(m-10+i<0) x = 1; //m次操作后无法变成10；
		else x = b[m-10+i];//变成10，在进行m-k操作，k是变成10所需操作数
		long long temp = (a[i]*x)%mod;
		ans+=temp;
		ans%=mod;
	}
	printf("%lld\n",ans);
	return;
}
int main(){
	int T;
	cin >> T;
	init();
	while (T--){
		long long n, m;
		scanf("%lld %lld",&n,&m);
		solve(m,n);
	}
	return 0;
}


```

