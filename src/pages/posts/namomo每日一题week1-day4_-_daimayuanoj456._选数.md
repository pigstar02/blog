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
pubDate: 2022-03-01 09:48:59.050000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week1-day4 - daimayuanoj456. 选数
---

[选数](http://oj.daimayuan.top/problem/456)

# **题意**
给你N个数，选出若干个，他们的和模N为0，输出这些数的个数和下标。

# **思路**
- 模N最多有N种结果[0,N)，对于这N个数的前缀和sum有N个，再加上全都不选的一个0，就有N+1个数值，则必有两个前缀相等，这两个前缀差分一下，中间那段和模N就是0.

# **代码**
```cpp
#include<bits/stdc++.h>
using namespace std;

#define int long long
#define endl '\n'



typedef double db;
typedef long long ll;
typedef unsigned long long ull;

#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
	cerr << *it << " = " << a << endl;
	err(++it, args...);
}

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
const int INF = 0x3f3f3f3f3f3f3f3f;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){

	cin >> N;
	vector<int> a(N + 1);
	for (int i = 1; i <= N; i ++) cin >> a[i], a[i] %= N;
		
	map<int,int> st;
	int sum = 0;
	st[0] = 0;
	for (int i = 1; i <= N; i ++) {
		(sum += a[i]) %= N;
		if (st.count(sum)) {
			cout << i-st[sum] << endl;
			for (int j = st[sum] + 1; j <= i; j ++) {
				cout << j << ' ';
			}
			return;
		}
		st[sum] = i;
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

