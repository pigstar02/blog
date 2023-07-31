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
pubDate: 2021-11-03 20:29:58.701000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 753
---

> 上场div2被卡到了1599，本来这场不掉分就能上蓝，却被D卡了一个小时，E17分钟就1A了。为什么rank1096也会掉分，div3太难上分了。-_-''

# A. Linear Keyboard
题意：先给你一个字典，再给你一个字符串，求字符串中相邻两个字母在字典中距离的和。

思路：用map简单映射一下就好了
```cpp
// Problem: A. Linear Keyboard
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/A
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){

		string s1,s;
		cin >> s1 >> s;
		N = sz(s);
		map<char,int> pos;
		rep(i,0,sz(s1)-1){
			pos[s1[i]] = i;
		}
		int ans = 0;
		rep(i,1,N-1){
			ans+=abs(pos[s[i]]-pos[s[i-1]]);
		}
		wtl(ans);
	}
    return 0;
} 
```
---
# B. Odd Grasshopper
题意：给定一个初始位置x，需要移动的步数n，第i步的步长为i，求最后所在的位置。

思路：手写几项可以发现（起点为偶数）四步后的位置的变化值是-1+2+3-4=0，-5+6+7-8=0...所以每四步都会回到起点，只需把n对4取模再模拟剩下的几步（小于4步）。

赛时逆天写了奇偶的分类讨论，人傻掉了😞

正解
---

```cpp
// Problem: B. Odd Grasshopper
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/B
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		int now,ans;
		cin >> now >> N;
		rep(i,N/4*4+1,N){
			if(now&1) now+=i;
			else now-=i;
		}
		wtl(now);
	}
    return 0;
} 
```
分类讨论
---
```cpp
// Problem: B. Odd Grasshopper
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/B
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// 
// Powered by CP Editor (https://cpeditor.org)
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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		int now,ans;
		cin >> now >> N;
		if(now&1){
			int ci = N/2;
			if(ci&1){
				 if((N&1)==0) ans = now-1;
				 else ans = now-1-N;
			}
			else {
				if((N&1)==0) ans = now;
				else ans = now+N;
			}
		}
		else{
			int ci = N/2;
			if(ci&1){
				 if((N&1)==0) ans = now+1;
				 else ans = now+1+N;
			}
			else {
				if((N&1)==0) ans = now;
				else ans = now-N;
			}
			
		}
		wtl(ans);
	






	}
    return 0;
} 
```
---
# C. Minimum Extraction
题意：给你一个数组，每次选择其中最小的一个x，让剩余元素减去x，再把x从数组中删除，知道数组为空。问每次删除前数组中最小值的最大值是多少。

思路：首先发现所有数减去一个相同的数并不会改变他们的相对大小，所以删去的顺序就是按照原数组从小到大。先从小到大排序，那么第i次删除前的最小值就是a[i]-a[i-1] (a[0]是0)，然后$O(n)$遍历取max

```cpp
// Problem: C. Minimum Extraction
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/C
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// 
// Powered by CP Editor (https://cpeditor.org)
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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		cin >> N;
		int mmax = -INF_L;

		rep(i,1,N){
			cin >> A[i];		
		}
		sort(A+1,A+1+N);
		rep(i,1,N){
			mmax = max(mmax,A[i]-A[i-1]);
		}
		wtl(mmax);
	}
    return 0;
} 
```
---
# D. Blue-Red Permutation
题意：有n个点的坐标，颜色；红色可以往右移，蓝色可以往左移。问能否将所有点移到1-n，每个位置一个点。

思路：首先有一种不满足的情况是<1的位置有蓝色的点或者>n的位置有红色的点那么这些点无法移动到区间[1,n]，一定是NO。
若有满足条件得情况如RBRBR那么一定可以变成BBRRR，也就是蓝色都在左边，红色都在右边。
所以我们将红蓝位置分别排序，从小到大枚举蓝色，如果坐标小于已经枚举得点就是NO，相当于左边放不下这么多蓝色；红色同理。

```cpp
// Problem: D. Blue-Red Permutation
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/D
// Memory Limit: 256 MB
// Time Limit: 1000 ms
// 
// Powered by CP Editor (https://cpeditor.org)


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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn];
vi G[maxn];
signed main()
{
	cin >> T;
	while(T--){
		cin >> N;
		string s;
		rep(i,1,N) cin >> A[i];
		cin >> s;
		s = ' '+s;
		
		int f = 1;
		rep(i,1,N){
			if(A[i]<1&&s[i]=='B') f = 0;
			else if(A[i]>N&&s[i]=='R') f = 0;
		}

		if(f==0){
			puts("NO");
			continue;
		}
		
		int pos = 1;
		rep(i,1,N){
			if(A[i]<1||A[i]>N) continue;
			if(s[i]=='B'){
				B.pb(A[i]);
			}
			else{
				R.pb(A[i]);
			}
		}
		sort(all(B));
		sort(all(R));
		
		int sum = 0;
		rep(i,0,sz(B)-1){
			
			if(B[i]<(i+1)) {
				f = 0;

			}
		}
		per(i,sz(R)-1,0){
			
			if((N-R[i]+1)<(sz(R)-i)) {
				f = 0;
			}
		}
		if(f==0){
			puts("NO");
			
		}
		else puts("YES");

	}
    return 0;
} 
```
---
# E. Robot on the Board 1
题意：有一串指令s和一个n*m的矩形，问将机器人放在哪个位置，能够执行尽可能多的步数。（走出矩形即结束或指令全执行完）

思路：不管从那个点开始，执行指令的路径事固定的，只要整个路径在矩形内就可以。一个路径能在矩形内，最右边-最左边<m && 最下边-最上边<n。所以我们只要遍历指令直到不符合条件break。然后把此时路径外切矩形的左上点放在（1，1），可以求出路径起点（0，0）在原坐标系的坐标。
```cpp
// Problem: E. Robot on the Board 1
// Contest: Codeforces Round #753 (Div. 3)
// URL: https://codeforces.com/contest/1607/problem/E
// Memory Limit: 256 MB
// Time Limit: 2000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

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
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
#define int long long
#define readI(l,r,A) for(int pig=l;pig<=r;pig++)	cin >> A[pig]
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
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
		string s;
		cin >> s;
		int n = sz(s);
		int x = 0, y = 0;
		int L = 0,R=0,U=0,D=0;
		rep(i,0,n-1){
			if(s[i]=='L') x--;
			if(s[i]=='R') x++;
			if(s[i]=='U') y--;
			if(s[i]=='D') y++;
			int tl = L,tr = R, tu = U, td = D;
			L = min(L,x);
			R = max(R,x);
			D = max(D,y);
			U = min(U,y);
			if(abs(R-L)>=M||abs(U-D)>=N){
				L = tl;
				R = tr;
				U = tu;
				D = td;
				break;
			}
		}
		
		U--;
		L--;
		wtb(-U);
		wtl(-L);

	}
    return 0;
} 
```