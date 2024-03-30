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
pubDate: 2022-03-05 17:54:44.541000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week2-day1 - daimayuanoj466. 摘桃子
---

# [摘桃子](http://oj.daimayuan.top/course/10/problem/466)

# 题意
有多少个字串（连续的）满足所有元素和模K等于字串的长度

# 思路
- 长度是和模K相同，那么长度不超过K，我们可以用滑动窗口
- 模K等于字串的长度，令a[i] = a[i] - 1，那么就是字串和模长度等于0
- 求有多少个区间和是K的倍数，我们把a[i]=%K然后再DP一下，K可能很大，要用map

# 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define debug(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

void err(istream_iterator<string> it) {}
template<typename T, typename... Args>
void err(istream_iterator<string> it, T a, Args... args) {
	cerr << *it << " = " << a << endl;
	err(++it, args...);
}
typedef double db;
typedef long long ll;
typedef unsigned long long ull;

int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}


const int maxn = 1e6+7;
const int mod = 1e9+7;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;



void solve(){
	
	cin >> N >> K;
	vector<int> a(N+1), sum(N+1);
	for (int i = 1; i <= N; i ++) {
		cin >> a[i];
		sum[i] = (sum[i-1] + a[i] - 1) % K;
	}
	
	map<int, int> cnt;
	
	cnt[0] = 1;
	int ans = 0;
	for (int i = 1; i <= N; i ++) {
		if(i >= K) cnt[sum[i - K]] --;//长度大于等于K了，左端点右滑
		ans += cnt[sum[i]];
		cnt[sum[i]] ++;
	}
	cout << ans << endl;
	
	
	



}
signed main()
{
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

