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
pubDate: 2022-02-22 17:05:34.381000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 770 (Div. 2).  F. Fibonacci Additions
---

### 题意
给你两个数组，每次进行操作后判断两个数组在模mod意义下是否相等。
- 操作A：给a数组l到r区间加上斐波那契数列的前r-l+1项
- 操作B：给b数组l到r区间加上斐波那契数列的前r-l+1项

### 思路
1. 很自然的，我们想到另c[i] = a[i] - b[i]，这样就把问题转化为了c[i]是否全部是0。
2. 接下来就是官方题解很妙的想法（太菜了，没见过）。根据斐波那契数列的规律构建一个D数组，D[1] = c[1], D[2] = c[2] - c[1],一般的D[i] = c[i] - c[i-1] - c[i-2],当D[i]全为0时显然D[i]全为。这样就把问题转化为了D[i]是否全部是0。
3.
   - 对于操作A，对A加上了一个斐波那契数列，等价于给c加上了斐波那契数列，而对于D的影响则是D[l] += 1, D[r+1] -= F[r-l+2], D[r+2] -= F[r-l+1]
   - 对于操作B，对B加上了一个斐波那契数列，等价于给c减少了斐波那契数列，而对于D的影响则是D[l] -= 1, D[r+1] += F[r-l+2], D[r+2] += F[r-l+1]
这样每次操作就变成O(3)修改

4. 对于每次操作我们维护一下D数组中0的个数就好。

### 代码
```cpp
#include<bits/stdc++.h>
using namespace std;

#define int long long
#define endl '\n'



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 1e6+7;
int mod = 1e9+7;

const double eps = 1e-6;
const int INF = 0x3f3f3f3f3f3f3f3f;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;
vector<int> fib(maxn);


void solve(){

	cin >> N >> Q >> mod;
	vector<int> a(N);
	
	for (int i = 0; i < N; i ++) {
		cin >> a[i];
	}
	for (int i = 0, x; i < N; i ++) {
		cin >> x;
		a[i] -= x;
		a[i] = (a[i] + mod) % mod;
	}
	
	fib.resize(N);
	fib[0] = fib[1] = 1;
	for (int i = 2; i < N; i ++) fib[i] = (fib[i-1] + fib[i - 2]) % mod;
		
	vector<int> D(N);
	D[0] = a[0];
	if (N >= 2) {
		D[1] = a[1] - a[0]; 
		D[1] = ((D[1] % mod) + mod) % mod;
	}
	for (int i = 2; i < N; i ++) {
		D[i] = (((a[i] - a[i-1] - a[i-2]) % mod) + mod) % mod;
	}
	
	int cnt_z = 0;
	for (int i = 0; i < N; i ++) cnt_z += D[i] == 0;
		
	// cout << cnt_z << "hhh" << endl;
	auto add = [&](int p, int v) {
		if (p < 0 || p >= N) return;
		cnt_z -= D[p] == 0;
		D[p] = (((D[p] + v) % mod) + mod) % mod;
		cnt_z += D[p] == 0;
	};
	for (int i = 0; i < Q; i ++) {
		char op;
		int l, r;
		cin >> op >> l >> r;
		l --, r --;
		if (op == 'A') {
			add(l, 1);
			add(r + 1, -fib[r-l+1]);
			add(r + 2, -fib[r-l]);
		} else {
			add(l, -1);
			add(r + 1, fib[r-l+1]);
			add(r + 2, fib[r-l]);
		}
		if (cnt_z == N) {
			cout << "YES\n";
		} else cout << "NO\n";
	}
	




}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 

```



