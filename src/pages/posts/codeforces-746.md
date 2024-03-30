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
pubDate: 2022-03-09 16:04:13.918000
tags:
- ACM
- ICPC
- 题解
theme: light
title: codeforces 746
---

### A. Gamer Hemose

**题意：**你有n个士兵，攻击力是ai，每个士兵攻击次数不限但不能连续攻击，最少几次能把血量为H的怪物杀死。

**思路：**由于不能连续攻击，我们让攻击力最大和第二大的士兵轮流攻击就好了。

**代码**

```cpp
#include<iostream>
#include<cstring>
#include<cmath>
#include<vector>
#include<map>
#include<set>
#include<queue>
#include<stack>
#include<deque>
#include<algorithm>

using namespace std;


#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define fi first
#define se second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f
#define INF_L 0x3f3f3f3f3f3f3f3f
#define debug(a) cout<<#a<<"="<<a<<endl;
#define Adebug(a,i) cout<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	iocin >> A[pig]
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



inline void wt(ll x){printf("%lld",x);}
inline void wtl(ll x){printf("%lld\n",x);}
inline void wtb(ll x){printf("%lld ",x);}
template <typename T> bool chkmx(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool chkmn(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return ((x%p)+p)%p;}
const int maxn = 1e6+7;

int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		cin >> N >> M;
		// int mmax = 0;
		rep(i,1,N) {
			cin >> A[i];
		}
		sort(A+1,A+1+N);
		int X = A[N]+A[N-1];
		int ans = M/X*2;
		if(M%X){
			if((M%X)>A[N]) ans+=2;
			else ans++;
		}
		wtl(ans);
	}
    return 0;
} 
```



---

### B. Hemose Shopping

**题意：**看能否将给定数组排序。方法为交换下标差大于等于X的两个元素。

**思路：**若该位置可以交换，则该位置上的元素一定可以换到对应位置；若该位置无法交换，则检查该位置上的元素是否在正确位置，若不在则否。

**代码**

```cpp
#include<iostream>
#include<cstring>
#include<cmath>
#include<vector>
#include<map>
#include<set>
#include<queue>
#include<stack>
#include<deque>
#include<algorithm>

using namespace std;

#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define fi first
#define se second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f
#define INF_L 0x3f3f3f3f3f3f3f3f
#define debug(a) cout<<#a<<"="<<a<<endl;
#define Adebug(a,i) cout<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	iocin >> A[pig]
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

inline void wt(ll x){printf("%lld",x);}
inline void wtl(ll x){printf("%lld\n",x);}
inline void wtb(ll x){printf("%lld ",x);}
template <typename T> bool chkmx(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool chkmn(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return ((x%p)+p)%p;}
const int maxn = 1e6+7;

int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn];
int B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		cin >> N >> M;
		
		rep(i,1,N){
			cin >> A[i];
      B[i] = A[i];
		}

    sort(B+1,B+1+N);
    int f = 1;
		rep(i,1,N){
      if(A[i]==B[i]) continue;
      if(i-1<M&&N-i<M) f = 0;//不能动的位置
    }
    if(f) puts("YES");
    else puts("NO");
	}
    return 0;
} 
```

---

### C. Bakry and Partitioning

**题意：**给你一棵树和各点的权值，给你一个K，通过去边将这棵树分成【2，K-1】个部分，各部分点权异或和相等。

**思路：**

1. 从k分类讨论（K>=2）

    - 当K等于2时只能分成两部分，又因为两部分的异或和相等，所以总的异或和一定为0。
    - 当K>=3时我们我们分成3部分，因为任意两个相同的可以合并成0，我们只要dfs找到两部分异或和分别为全部的异或和即可。

2. 从全部异或和xosum讨论
		- xosum等于0，以定位YES，因为一定可以分成两部分相同的。
		- xosum不等于0则要求K!=2，因为至少分成3份；而且dfs同样要至少两部分异或和邓异xosum。

**代码**
```cpp
#include<iostream>
#include<cstring>
#include<cmath>
#include<vector>
#include<map>
#include<set>
#include<queue>
#include<stack>
#include<deque>
#include<algorithm>

using namespace std;

#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define fi first
#define se second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f
#define INF_L 0x3f3f3f3f3f3f3f3f
#define debug(a) cout<<#a<<"="<<a<<endl;
#define Adebug(a,i) cout<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	iocin >> A[pig]
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


inline void wt(ll x){printf("%lld",x);}
inline void wtl(ll x){printf("%lld\n",x);}
inline void wtb(ll x){printf("%lld ",x);}
template <typename T> bool chkmx(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool chkmn(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return ((x%p)+p)%p;}
const int maxn = 1e6+7;

int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
int xosum = 0,cnt;
int dfs(int u,int fa){
	for(int i = 0; i < G[u].size(); i ++){
		int to = G[u][i];
		if(to==fa) continue;
		dfs(to,u);
		A[u]^=A[to];
	}
	if(A[u]==xosum){
		A[u] = 0;
		cnt++;
	}
	return 0;
}
signed main()
{
	iocin >> T;
	while(T--){
		iocin >> N >> M;
		xosum = 0;
		cnt = 0;
		rep(i,1,N){
			iocin >> A[i];
			xosum^=A[i];
			G[i].clear();
		}
		
		rep(i,1,N-1){
			int u,v;
			iocin >> u >> v;
			G[u].pb(v);
			G[v].pb(u);
		}
		if(xosum==0){ 
		    puts("YES");
		    continue;
		}
		else dfs(1,0);
		if(M>=3&&cnt>=2) puts("YES");
		else puts("NO");
	}
    return 0;
} 
```

