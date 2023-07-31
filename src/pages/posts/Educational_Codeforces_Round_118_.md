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
pubDate: 2021-12-03 14:19:16.695000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Educational Codeforces Round 118
---

## A. Long Comparison

**题意：**
给你x1，p1，x2，p2，代表了两个数，x1 * pow（10，p1）和x2 * pow（10，p2），比较两个数的大小。

**思路**
- 首先比较两个数字的长度，长度长的肯定大（说了没有前导零）
- 长度相等的情况下，只要把长度短的数字末尾补0补到和长度长的数字一样，然后比较字符串就好了。

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

	int a, b, p1, p2;
	cin >> a >> p1 >> b >> p2;
	string s1 = to_string(a), s2 = to_string(b);
	N = s1.size(), M = s2.size();
	if(N+p1>M+p2){
		cout << ">\n";
	}
	else if(N+p1<M+p2){
		cout << "<\n";
	}
	else{
		if(N<M){
			rep(i,1,M-N) s1 = s1 + '0';
		}
		else{
			rep(i,1,N-M) s2 = s2 + '0';
		}
		
		rep(i,0,max(sz(s1),sz(s2))-1)//其实不用循环，可以直接字符串比较
		{
			if(s1[i]>s2[i]){
				return;
			}
			else if(s1[i] < s2[i]){
				cout << "<\n";
				return;
			}
		}
		cout << "=\n";

	}

}
signed main()
{
	IOS
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```

* * *

## B. Absent Remainder
**题意** 
给你n个数，请你找到n/2对数，大数模小数的结果在原来n个数中没有出现过。

**思路**
对于小的数我们总是选择原数列最小的，这样%完的结果一定比最小的数小，那么在原数列这个数肯定不存来。

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

	cin >> N;
	rep(i,1,N) cin >> A[i];
	sort(A+1,A+1+N);
	
	rep(i,2,(N/2)+1){
		cout << A[i] << ' ' << A[1] << endl;;
	}

}
signed main()
{
	IOS
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```

* * *
## C. Poisoned Dagger
**题意**
给你一个N，H，代表你攻击的次数，怪物的血量，再给你N个数代表N次攻击的时间点。攻击力为x，指第t秒攻击后，t，t+1...t+x-1，每秒造成一点伤害，如果上一次攻击效果失效之前又进行了一次攻击，那么之前的效果消失，只计算当前最新的攻击。求可以杀死怪物的最小x。

**思路**
如果x攻击力能杀死怪物，那么x+1攻击力一定可以杀死怪物，满足二分性。

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

int ck(int x){
	int ans = 0;
	rep(i,1,N-1){
		if(A[i]+x>=A[i+1]){
			ans+=A[i+1]-A[i];
		}
		else{
			ans+=x;
		}
	}
	ans+=x;
	if(ans>=M) return 1;
	else return 0;
}
void solve(){
	cin >> N >> M;
	rep(i,1,N) cin >> A[i];
	int l = 1, r = M;
	while(l<r){
		int mid = (l+r) >> 1;
		if(ck(mid)) r = mid;
		else l = mid+1;
	}
	
	cout << l <<endl;	
}
signed main()
{
	IOS
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```

***
## D. MEX Sequences
**题意**
给你一个长度为n的数组，问有多少个子序列（不连续）满足对于子序列中每个元素的值和它的前缀MEX相差绝对值小于等于1.

**思路**
DP
1. 状态表示 dp[i][0] 表示MEX = i，最大值为i-1 ； dp[i][1] 表示MEX = i，最大值为i+1。
	可能会有最大值为i+2的情况，但这种不满足题目要求。
	
2. 答案累加
	当前的数是A[i]，那么加上A[i]后序列符合条件的MEX应该是A[i] ( 不可能，当前的数就是A[i] ), A[i]-1 , A[i]+1。
	- 原来的dp[A[i]-1][0] 和 dp[A[i]-1][1]加上一个A[i]后MEX变为A[i]
	- 原来的dp[A[i]][0] 加上一个A[i]后MEX变为A[i]+1
	- 原来的dp[A[i]+1][0] 和  dp[A[i]+1][1] 加上一个A[i]后MEX变成A[i]+1
	
	**所以答案累加上上述的dp数组就好了**
3. dp数组更新
	当前的数是A[i]
	- dp[A[i]-1][1] *= 2	
	- dp[A[i]-1][1] += dp[A[i]-1][0]
	- dp[A[i]+1][0] *= 2
	- dp[A[i]+1][0] += dp[A[i]][0]
	- dp[A[i]+1][1] *= 2

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
const int mod = 998244353;
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
int A[maxn],B[maxn],dp[maxn][2],f[maxn];


void solve(){

	cin >> N;
	rep(i,1,N) cin >> A[i];

	rep(i,1,N+6) dp[i][0] = dp[i][1] = 0;
	dp[0][0] = 1;
	dp[0][1] = 0;
	int ans = 0;
	rep(i,1,N){
		if(A[i]) ans+=dp[A[i]-1][0] + dp[A[i]-1][1];
		ans += dp[A[i]][0] + dp[A[i]+1][0] + dp[A[i]+1][1];
		ans %= mod;
		if(A[i]){
			dp[A[i]-1][1] *= 2;
			dp[A[i]-1][1] += dp[A[i]-1][0];
			dp[A[i]-1][1] %= mod;
		}
		dp[A[i]+1][0] *= 2;
		dp[A[i]+1][0] += dp[A[i]][0];
		dp[A[i]+1][1] *= 2;
		dp[A[i]+1][1] %= mod;
		dp[A[i]+1][0] %= mod;
	}
	cout << ans%mod << endl;




	
}
signed main()
{
	// IOS
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```
---
## E. Crazy Robot
**题意**
给你一个N*M的图，只包含'.'  '#'  'L'  代表了空地，障碍，终点。空地放置一个坏了的机器人，你给他一个指令，他会向除了你给的方向的其他方向移动，如果无法移动他将原地不动，问你能否通过一些指令，使他到达终点。把满足的起点标位’+‘  ，再把图输出

**思路**
首先满足的空地是一个联通块。我们只需要从终点开始BFS即可。如果一个点可以走的方向小于等于1个，我们就可以控制他的走向了，具体看代码。

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

string g[maxn];
void solve(){

	cin >> N >> M;

	rep(i,1,N) cin >> g[i], g[i] = ' ' + g[i];

	int xx,yy;
	rep(i,1,N)
		rep(j,1,M)
		{
			if(g[i][j]=='L')
			{
				xx = i;
				yy = j;
			}
		}
	map<PII,int> st;
	queue<PII> q;
	q.push(mk(xx,yy));
	st[mk(xx,yy)] = -1;
	while(q.size())
	{
		PII t = q.front();
		q.pop();
		xx = t.fi, yy = t.se;
		
		rep(i,0,3)//枚举周围的点
		{
			int tx = xx + dx[i];
			int ty = yy + dy[i];
			if(tx > N || tx < 1 || ty < 1 || ty > M) continue;
			if(g[tx][ty] == '#') continue;
			int dir = 0;
			rep(j,0,3)//判断这个点符不符合
			{
				int ttx = tx + dx[j];
				int tty = ty + dy[j];
				//不能走的点和已经确认成功的点都continue掉
				if(ttx > N || ttx < 1 || tty < 1 || tty > M) continue;
				if(g[ttx][tty] == '#') continue;
				if(st[mk(ttx,tty)]) continue;
				dir ++;
			}

			if(dir <= 1 && !st[mk(tx,ty)]){//不确认的方向只有一个，可以用指令排除掉
				// cout << tx << "tx---ty" << ty <<endl;
				q.push(mk(tx,ty));
				st[mk(tx,ty)] = 1;
			}
		}
		
	}
	rep(i,1,N){
		rep(j,1,M)
		{
			if(st[mk(i,j)] && g[i][j] == '.') cout << '+';
			else cout << g[i][j];
		}
		cout << endl;
	}

}
signed main()
{
	IOS
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```