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
pubDate: 2021-10-08 00:21:15
tags:
- ACM
- ICPC
- 题解
theme: light
title: 树形DP
---

### [P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352)

**题意：**求选择的点的权值和最大。限制条件：若父节点被选，子节点不能被选

状态机模型，不过不能用循环枚举顺序，用树上dfs递归的方式进行枚举。

代码

```cpp
/*******************************
| Author:  pigstar
| Problem: P1352 没有上司的舞会
| Contest: Luogu
| URL:     https://www.luogu.com.cn/problem/P1352
| When:    2021-10-08 09:33:54
| 
| Memory:  128 MB
| Time:    1000 ms
*******************************/
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
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],B[maxn];
int st[maxn],vis[maxn];
vi G[maxn];
int dp[maxn][2];
void dfs(int u){
	vis[u] = 1;//搜索过了
	rep(i,0,(sz(G[u])-1)){
		int to = G[u][i];
		if(vis[to]) continue;
		dfs(to);
		dp[u][0]+=max(dp[to][0],dp[to][1]);//当前节点不去，下属可以去也可以不去
		dp[u][1]+=dp[to][0];//当前节点去，下属不能去
	}
	return;
}
signed main()
{
		cin>> N;
		rep(i,1,N) cin >> dp[i][1];

		rep(i,1,N-1){
			int L, K;
			cin >> L >> K;
			st[L] = 1;//标记不是根节点
			G[K].pb(L);
		}

		rep(i,1,N){
			if(!st[i]){//从根节点开始dfs
				dfs(i);
				cout << max(dp[i][1],dp[i][0]);
				return 0;
			}
		}
    return 0;
} 
```

----

### [Computer](http://acm.hdu.edu.cn/showproblem.php?pid=2196)

**题意：**求每个点与其他任意一点的最远距离

给的是一棵树，每个节点都有且只有一个父亲。且本题节点1是根节点。

对于一个节点他的最远距离有两种

- **向下：**以当前节点为根的子树的深度（由dfs1可得到）
- **向上：**父节点的最远距离再加上当前节点到父节点的距离

然后这两种取最大值

代码

```cpp
/*******************************
| Author:  pigstar
| Problem: Computer
| Contest: HDOJ
| URL:     http://acm.hdu.edu.cn/showproblem.php?pid=2196
| When:    2021-10-08 10:04:01
| 
| Memory:  32 MB
| Time:    1000 ms
*******************************/
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
// #define int long long
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
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e4+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int id[maxn];
int dp[maxn][3];
struct edge{
	int to,v;
};
vector<edge> G[maxn];

void dfs1(int u,int fa){
	for(int i = 0; i < sz(G[u]); i ++ ){
		int to = G[u][i].to, v = G[u][i].v;
		if(to==fa) continue;
		dfs1(to,u);//先递归到子节点，由儿子信息得到父亲节点信息
		if(chkmx(dp[u][0],dp[to][0]+v)){
			id[u]= to;//记录最长路径的方向
		}
	}
	for(int i = 0; i < sz(G[u]); i ++ ){
		int to = G[u][i].to, v = G[u][i].v;
		if(to==fa||to==id[u]) continue;//去掉最长距离就是次长距离了
		chkmx(dp[u][1],dp[to][0]+v);
	}
}

void dfs2(int u, int fa){
	for(int i = 0; i < sz(G[u]); i ++ ){
		int to = G[u][i].to, v = G[u][i].v;
		if(to==fa) continue;
		if(to==id[u]){//当前是最长路径，不能重复走所以只能次长距离
			dp[to][2] = max(dp[u][2],dp[u][1])+v;
		}
		else{
			dp[to][2] = max(dp[u][2],dp[u][0])+v;
		}
		dfs2(to,u);
	}
	return;
}
signed main()
{

	while(~scanf("%d",&N)){
    //多组测试数据，初始化
		mem(dp,0);
		rep(i,1,N) {
			id[i] = 1;
			G[i].clear();
		}
    //建图
		for(int i = 2; i <= N; i ++){
			int a,b;
			cin >> a >> b;
			G[i].pb({a,b});
			G[a].pb({i,b});
		}
    
		dfs1(1,-1);//求出向下的最长距离dp[][0]和次长距离dp[][1]
		dfs2(1,-1);//求出向上的最长距离
		rep(i,1,N){
			wtl(max(dp[i][0],dp[i][2]));//向下和向上取Max
		}
	}
    return 0;
} 
```

---

### [Strategic game](http://poj.org/problem?id=1463)

**题意：**给你一幅图，要求每条边至少一个端点为1，求所有端点权值和最小值。

也是状态机加上dfs的递归顺序。

- 如果当前节点为1，相邻节点可以为0，1，累加其中的最小值。（别忘了加上当前节点本身的1）
- 如果当前节点为0，相邻节点必须为1，累加即可。

从根节点开始先递归在DP计算，这样最后答案在根节点的dp数组中。

代码

```cpp
/*******************************
| Author:  pigstar
| Problem: Strategic game
| Contest: POJ - Southeastern Europe 2000
| URL:     http://poj.org/problem?id=1463
| When:    2021-10-08 14:39:50
| 
| Memory:  10 MB
| Time:    2000 ms
*******************************/
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
// #define int long long
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
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e4+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int dp[maxn][2],B[maxn];
int st[maxn];
vi G[maxn];
void dfs(int u, int fa){
	dp[u][1] = 1;//当前节点本身的权值
	rep(i,0,sz(G[u])-1){
		int to = G[u][i];
		if(to==fa) continue;
		dfs(to,u);//先递归再计算
		dp[u][1] += min(dp[to][1],dp[to][0]);//当前为1
		dp[u][0]+=dp[to][1];//当前为0
		
	}
}
signed main()
{
	while(~scanf("%d",&N)){
    mem(dp,0);
		rep(i,0,N) G[i].clear();//初始化，否则MLE
		rep(i,1,N){//建图
			int a,k,b;
			cin >> a;
			getchar();
			getchar();
			cin >> k;
			getchar();
			rep(j,1,k){
				cin >> b;
				G[a].pb(b);
				G[b].pb(a);
			}
		}
		dfs(1,-1);
		wtl(min(dp[1][0],dp[1][1]));
		
	}
    return 0;
} 
```

---

### [FAR-FarmCraft](https://www.luogu.com.cn/problem/P3574)

代码

```cpp
/*******************************
| Author:  pigstar
| Problem: P3574 [POI2014]FAR-FarmCraft
| Contest: Luogu
| URL:     https://www.luogu.com.cn/problem/P3574
| When:    2021-10-08 17:52:39
| 
| Memory:  125 MB
| Time:    1000 ms
*******************************/
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
int gcd(int a,int b){return b?gcd(b,a%b):a;
}
const int maxn = 1e6+7;
const int mod = 1e9+7;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T,N,M;
int A[maxn],siz[maxn];//遍历完子树的时间，每条边是1
int st[maxn];
vi G[maxn];
int dp[maxn];//以i为根的子树所有居民安装完电脑的时间
bool cmp(int a,int b){
	int sa = siz[a], sb = siz[b];
	a = dp[a], b = dp[b];
	return sa-a<sb-b;//需要等待的时间从小到大排序
}
void dfs(int u, int fa){
	if(u!=1) dp[u] = A[u];
	rep(i,0,sz(G[u])-1){
		int to = G[u][i];
		if(to==fa) continue;
		dfs(to,u);
	}
	sort(all(G[u]),cmp);//贪心排序
	rep(i,0,sz(G[u])-1){
		int to = G[u][i];
		if(to==fa) continue;
		chkmx(dp[u],dp[to]+siz[u]+1);//当前子树完成时间是所有儿子子树完成时间的最大值，+1是当前节点去儿子的时间，回来覆盖在了等待时间内
		siz[u] += siz[to]+2;//每次回到父亲节点增加的时间都是儿子遍历完时间加2
	}
}
signed main()
{
	cin >> N;
	rep(i,1,N) cin >> A[i];
	rep(i,2,N){
		int a, b;
		cin >> a >> b;
		G[a].pb(b);
		G[b].pb(a);
	}
	dfs(1,0);
	wtl(max(dp[1],siz[1]+A[1]));
    return 0;
} 
```

---

**未完待续...**

