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
pubDate: 2022-01-18 15:23:56.213000
tags:
- ACM
- ICPC
- 题解
theme: light
title: 第九届“图灵杯”NEUQ-ACM程序设计竞赛个人赛  K金牌厨师
---

**题目描述**
Phenix作为食堂的金牌厨师，每天的工作是为同学们准备饭菜，Phenix做出的每一种菜都有一个辣度值，范围是[1,n][1,n]。作为厨师，Phenix提前了解了m位同学的辣度接受范围，第i位同学的辣度接受范围被描述为$`$[l_i,r_i]$`$，表示该同学可以接受辣度值位于这个区间的菜。由于众口难调，每天Phenix会选出部分同学，做出能让这部分同学都接受的辣度的菜。Phenix作为金牌厨师对每天工作的满意程度定义为选出的同学的人数kk和能让这部分同学都接受的菜的种类数xx（这里理解为一种辣度对应一种菜）两者中的最小值，即min(k,x)。(1<=n,m<=300000)。

现在你需要想办法让Phenix的满意程度最大。


**输入描述:**
第一行两个整数n,m，表示菜的辣度最大值和同学的人数(1<=n,m<=300000)。

接下来m行,每行两个整数$`$[l_i,r_i]$`$依次表示第i个同学的辣度接受范围(1<=$`$[l_i,r_i]$`$<=n)

**输出描述:**
一行，表示满意度的最大值。

**思路：**
二分min(k,x)
check：如果所有同学中有大于等于mid人共同覆盖的区间大于等于mid则return 1；否则return 0。

**代码**
```cpp
#include<bits/stdc++.h>
using namespace std;

#define IOS ios::sync_with_stdio(false);cin.tie(0);
#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define fi first
#define se second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f3f3f3f3f
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define rep(i, a, b) for(int i = (a); i <= (b); i ++)
#define per(i, a, b) for(int i = (a); i >= (b); i --)
#define vi vector<int>
#define vpii vector<PII>
#define pb push_back
#define rvs(s) reverse(s.begin(),s.end())
#define all(s) s.begin(),s.end()
#define sz(s) (int)(s.size())
#define lb(s) ((s) & (-s))
#define mk(s, t) make_pair(s, t)
#define CN puts("NO")
#define CY puts("YES")



inline void wt(int x){cout << x;}
inline void wtl(int x){cout << x << endl;}
inline void wtb(int x){cout << x << ' ';}
inline void wt(char x){cout << x;}
inline void wtl(char x){cout << x << endl;}
inline void wtb(char x){cout << x << ' ';}
inline void wt(string x){cout << x;}
inline void wtl(string x){cout << x << endl;}
inline void wtb(string x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
int fact[maxn], infact[maxn];
void jie_init(int n){
	fact[0] = 1;
	rep(i,1,n) fact[i] = fact[i-1] * i % mod;	
	infact[n] = qmi(fact[n],mod-2,mod);
	per(i,n-1,0) infact[i] = infact[i+1] * (i+1) % mod;	
}
int C(int n, int m){return fact[n] * infact[m] % mod * infact[n-m] % mod;}
int T = 1,N,M,K;
int A[maxn],B[maxn],dp[maxn],f[maxn];


void solve(){

	cin >> N >> M;
	vector<PII> stu;
	int ans = 0;
	int l = 1, r = min(N,M);
	while (M--) {
		int l, r;
		 cin >> l >> r;
		 stu.pb(mk(l,r));
	}

	

	function<int(int)> check = [&](int x){
		int k = 0;
		vector<int> st(N+7,0);
		for (int i = 0; i < stu.size(); i ++) {
			int len = stu[i].second - stu[i].first + 1;
			if (len >= x) {
				k ++;
				st[stu[i].fi+x-1] ++;
				st[stu[i].se+1] --;
				/*
				用差分对区间加1
				加了一说明这个位置往前x个都被当前同学覆盖了
				*/
			}
		}

		int cnt = 0;
		for (int i = 1; i <= N; i ++) {
			st[i] += st[i-1];
			if (st[i] >= x) return 1;//说明当前位置往前x个被大于等于x个同学覆盖
		}

		return 0;
	};

	

	while (l < r) {
		int mid = (l + r) >> 1;
		if (check(mid)) ans = mid,l = mid + 1;
		else r = mid;
	}
	cout << ans;


	
}
signed main()
{
	IOS
	// cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```
