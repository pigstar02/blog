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
pubDate: 2021-11-13 16:50:10.633000
tags:
- ACM
- ICPC
- 题解
theme: light
title: Codeforces Round 754 (Div. 2)
---

> 赛时只做出了ABC，D想的很接近了，但是后面染色的部分没搞出来
Anyway，我上蓝了！！！😄无数次接近1600，然后晋级赛就像被降智了一样掉大分。
![WechatIMG13.png](/upload/2021/11/WechatIMG13-5c1549fe9b4e416590f62978dc9f9db4.png)

---
### A. A.M. Deviation
**题意：** 给你a，b，c三个数，求$`|a+c-2 × c|`$ 的最小值。然后你可以
- 把a或c加1，然后b减1
- 把a或c减1，然后b加1
可以操作无限次

**题解：** 每次操作对答案的影响是3，所以我们只需要对($`a+c-2 × c`$)%3,那么答案可能是-2，-1，0，1，2；当等于-2时可以加3变成1，当等于2时可以减3等于-1.所以答案只有0或1，且只有原来等于0的是0。

``` cpp
#include<bits/stdc++.h>
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M,K;
int A[maxn],B[maxn],dp[maxn],f[maxn];
int st[maxn];

void solve(){
	int a, b, c;
	cin >> a >> b >> c;
	int dif = (a+c-2*b)%3;
	wtl(dif?1:0);



	
}
signed main()
{
	cin >> T;
	while(T--) solve();
    return (0-0); //<3
} 
```

### B. Reverse Sort
**题意：** 给你一个01串，将它变成非降序。
- 每次操作选择一个非增序的非连续子串，使其变成非降序。
问最少需要几次操作


**题解：** 首先我们可以肯定的是最后的字符串一定是前面连续0，后面连续1（0000001111）。那么我们只需要把后面应该是1的0和前面应该是0的1排序即可。且这样选择的子串保证是非增序的。

```cpp
#include<bits/stdc++.h>
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M,K;
int A[maxn],B[maxn],dp[maxn],f[maxn];
int st[maxn];
int sum1;
string s;
void solve(){

	cin >> N;
	cin >> s;
	sum1 = 0;
	rep(i,0,N-1){
		sum1+=(s[i]=='1');
	}
	int ordered = 1,cnt = 0;
	rep(i,0,N-sum1-1){
		if(s[i]=='1'){
			ordered = 0;
			cnt++;
		}
	}
	if(ordered){
		wtl(0);
		return;
	}
	wtl(1);
	wtb(cnt*2);
	rep(i,0,N-sum1-1){
		if(s[i]=='1') wtb(i+1);
	}
	rep(i,N-sum1,N-1){
		if(s[i]=='0') wtb(i+1);
	}
	puts("");

	
}
signed main()
{
	cin >> T;
	while(T--) solve();
    return (0-0); //<3
} 
```

### C. Dominant Character
**题意：** 给你一个只包含‘a’，‘b’，‘c’的字符串，找到长度>1的最短的连续子串满足，a的个数严格大于b，c的个数。找不到输出-1.

**题解：** 答案其实只有-1，2，3，4，7这五种，枚举长度再暴力check就好了。
- 如果存在aa，那么答案就是2
- 当a...a中间有x个b，y个c时，当y和x大于1时就不成立了，所以只能是aba或aca，答案是3；或者abca，acba，答案是4
- 或者是a...a...a，此时中间最多放2个b，2个c，只能是abbacca或accabba，答案为7。

```cpp
#include<bits/stdc++.h>
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M,K;
int A[maxn],B[maxn],dp[maxn],f[maxn];
int st[maxn];

void solve(){
	cin >> N;
	string s;
	cin >> s;
	rep(len,2,7){
		rep(i,0,N-1){
			if(i+len>N) break;
			int a = 0, b = 0, c = 0;
			rep(j,i,i+len-1){
				if(s[j]=='a') a++;
				else if(s[j]=='b') b++;
				else c++;
			}
			if(a>b&&a>c){
				wtl(len);
				return;
			}
		}
	}
	wtl(-1);

	
}
signed main()
{
	cin >> T;
	while(T--) solve();
    return (0-0); //<3
} 
```

### D. Treelabeling
**题意：** 给你一棵树，每个点都有一个权值，如果两个点权值为u，v，且u^v<=min(u,v)那么这两个点相连。然后两个人依次选择一个点，这个点没被 选过且和前一人选的相连的，选不了的人就输了；第一个人可以从任意一个点开始。请构造一个1-N的排列对应1-N编号点的权值，使得先手必胜的点最多。

**题解：** 首先一个结论是先手胜的点最多是N就是每个点都是先手必胜。
1. 题目转化成一棵树任意两个相邻点不互通，即（u^v）> min(u,v)，只需要u，v的二进制位数不一样就行。以为异或后的位数和max(u,v)相同，肯定大于min(u,v).
2. 由此我们可以想到染色问题。先将这棵树进行01染色。把节点编号放到所染颜色的集合中。
3. 对于2进制位数相同的权值不能放在相邻两个节点，也就是必须放在同一种颜色的节点。
4. 哪种颜色剩余的多就把当前枚举到的权值放那种颜色的节点里。
5. 枚举权值要从权值位数从大到小枚举，因为如果从小到大，最后一种位数的权值个数很多，大于剩余黑白节点中较多的个数，那么他就会被分到黑色和白色的节点，两者可能是相邻的。

```cpp
#include<bits/stdc++.h>
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


inline void wt(ll x){cout << x;}
inline void wtl(ll x){cout << x << endl;}
inline void wtb(ll x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qmi(int a, int k, int p){int res = 1;while (k){if (k & 1) res = (ll)res * a % p;a = (ll)a * a % p;k >>= 1;}return res;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M,K;
int h_bit[maxn];
int ans[maxn];
vi G[maxn], node[2];
void init(){\\预处理每个数的二进制位数
	int bit = 1, cnt = 1, nxt = 2;
	rep(i,1,2e5+7){
		h_bit[i] = bit;
		cnt--;
		if(cnt==0){
			cnt = nxt;
			bit++;
			nxt<<=1;
		}
	}
}

void dfs(int u, int fa, int col){\\01染色
	node[col].pb(u);\\把节点编号存入所染颜色的桶里
	for(auto x : G[u]){
		if(x == fa) continue;
		dfs(x,u,col^1);
	}
}
void solve(){
	cin >> N;
	rep(i,1,N) G[i].clear();
	rep(i,2,N){
		int u, v;
		cin >> u >> v;
		G[u].pb(v);
		G[v].pb(u);
	}
	dfs(1,-1,1);\\染色

	vector<vi> v(20);
	rep(i,1,N){
		v[h_bit[i]].pb(i);\\把所有权值分类
	}

	per(i,19,0){\\枚举二进制长度
		int cur = 0;
		if(sz(node[1]) > sz(node[0])) cur = 1;\\选择剩余节点较多的颜色

		for(auto &x : v[i]){\\把当前权值赋值给这个颜色
			int t = node[cur].back();
			node[cur].pop_back();
			ans[t] = x;
		}
	}
	rep(i,1,N) wtb(ans[i]);
	puts("");




	
}
signed main()
{
	cin >> T;
	init();
	while(T--) solve();
    return (0-0); //<3
} 
```

