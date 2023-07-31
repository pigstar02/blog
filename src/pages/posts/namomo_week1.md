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
pubDate: 2022-02-28 17:11:39.350000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo week1
---

# [题单](https://vjudge.net/contest/483210)
# A - Crystalfly
### **题意**
给你一棵树，每个点上有a[i]个蝴蝶，当你走到u点，与u相邻的v的蝴蝶会在t[v]秒之后被惊动逃走（但是v的儿子不会被惊动），问你最多能抓到几只蝴蝶。

### **思路**
可以注意到t数组的范围是1<= t <= 3，我们跟据t把u的儿子分为三类。第一秒可以选三类中的任意一个，第二秒可以选择继续走第一秒选择的儿子，或者是回到u，但是此时第三秒只能走t=3的那个儿子了（一来一回过去了2秒，t小于3的蝴蝶都被惊动飞走了,而往第一秒选择的儿子走显然不是最优）。
这两类行走方案如下
![image.png](/upload/2022/02/image-a2f2948ff89345e8a3e1429c4135acb8.png)
![image.png](/upload/2022/02/image-5b2d036624f841cc9af43222cd206d8b.png)

我们先不管根结点u抓不抓得到
定义
- dp[i][0]代表i不选并且所有儿子已经不能再抓了的最大值（就是两种路线取最大值）
- dp[i][1]代表i选并且所有儿子已经不能再抓了的最大值
- dp[i][2]代表i不选并且所有儿子都不选且已经不能再抓了的最大值
1. 第一张图
   - 我们选择第一个儿子，其他儿子都不选，所以dp[u][0] = sum{dp[son][0]} 加上a最大的一个儿子
   - dp[u][2]相比于此时的dp[u][0]差别在于少加一个a最大的儿子
2. 第二张图
   - 我们枚举那些可以二次拯救的点（即t=3的点），假设所有点的贡献都是dp[i][0],就是sum{dp[son][0]}，就是dp[u][2]，然后拯救的点（第三步走的点）j的a[j]可以加上。对于每个点v变成第一步走的点贡献变化是a[v] + dp[v][2] - dp[v][0]，显然我们要选变化最大的点走第一步，但是这个点可能和我们枚举的拯救的点是同一点，所以我们要记录变化前二大的点(判断点是否是同一个点，所以还要记录点的编号)。
   - 由此dp[u][0] = max(dp[u][0],dp[u][2] + a[j] + (c[0].second == j ? c[1].first : c[0].first))

最后dp[u][1] = dp[u][0] + a[u]


### **代码**
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
int e[maxn],w[maxn],ne[maxn],h[maxn],idx;

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
	e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}
vector<int> a(maxn),t(maxn);
vector<vector<int>> dp(3,vector<int>(maxn));

void dfs(int u, int fa) {
	
	dp[0][u] = 0;
	int max_son = 0;
	int son_num = 0;
	vector<pair<int, int> > c = {make_pair(-1e18,0ll), make_pair(-1e18,0ll),make_pair(-1e18,0ll)};
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		if (j == fa) continue;
		son_num++;
		dfs(j, u);
		max_son = max(max_son, a[j]);
		dp[0][u] += dp[0][j];
		c[2] = make_pair(a[j] + dp[2][j] - dp[0][j],j);
		sort(c.begin(),c.end(),[&](pair<int, int> aa, pair<int, int> bb) {
			if (aa.first != bb.first) {
				return aa.first > bb.first;
			} else {
				return aa.second < bb.second;
			}
		});
	}
	
	int temp = dp[0][u];
	dp[2][u] = dp[0][u];
	dp[0][u] = dp[0][u] + max_son;//找个最大儿子进，其他县摆烂
	
	// if (son_num > 1) {
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		if (j == fa || t[j] != 3) continue;
		//回首套的点
		dp[0][u] = max(dp[0][u], temp + a[j] + (c[0].second == j ? c[1].first : c[0].first));
	}
	// }
	
	dp[1][u] = dp[0][u] + a[u];
	
}
void solve(){
	
	cin >> N;
	idx = 0;
	memset(h,-1,sizeof(int)*(N+10));


	for (int i = 1; i <= N; i ++) cin >> a[i];
	for (int i = 1; i <= N; i ++) cin >> t[i];
	
	for (int i = 1; i < N; i ++) {
		int u, v;
		cin >> u >> v;
		add(u, v);
		add(v, u);
	}
	
	dfs(1, -1);
	cout << dp[1][1] << endl;


}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 

```



# B - Towers
### **题意**
给你一棵树，每个点的权值为a[i]，现在要求你给每个点的e[i]赋值，使得**每个点**都存在两个点u，v，这个点在u，v的简单路径上，且e[u]>=a[i]且e[v]>=a[i]。求所有e[i]的和（e[i] >= 0）

### **思路**
我们首先找到权值最大的点root，以它为根。因为根最大，肯定有两个点的e是a[root]是专门用来满足root的。这样对于除了根以外的所有点i都可以从上述两个点其中一个到根再到i，这样来获得u，v的其中一个。而另一个一定是在i的子树当中(包括i本身)。如果子树的最大值大于等于a[i]了，那么e[i]=0,不需要额外开销；如果子树的最大值小于a[i],我们则需要把最大值补成a[i]，开销是a[i]-max。

因为要先知道子树中的最大值，所以我们先递归到叶子结点，在回溯时从下往上处理。

当回溯到根的时候，因为我们一开始是设了两个点的e等于a[root]的，他们应该在root不同的儿子里，要不然就不是简单路径了。所以我们把root的每个儿子的子树的最大值存起来，取前两个大的补成a[root]。

但是root可能只有一个儿子，那么我们只需要把e[root]设为a[root]

### **代码**
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define error(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

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

int e[maxn],w[maxn],ne[maxn],h[maxn],idx;

void add(int a, int b) {
	e[idx] = b, ne[idx] = h[a], h[a] = idx ++;
}
void add(int a, int b, int c) {
	e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx ++;
}

int ans = 0;
int root = 1;
vector<int> a(maxn);
int dfs(int u, int fa) {
	int mx = 0;
	vector<int> mmax;
	for (int i = h[u]; ~i; i = ne[i]) {
		int j = e[i];
		if (j == fa) continue;
		int t = dfs(j, u);
		mx = max(mx, t);
		if (u == root) {
			mmax.push_back(-t);
		}
	}
	if (u == root) {
		sort(mmax.begin(),mmax.end());
		ans += max(0ll,a[root] + mmax[0]);
		if (mmax.size() < 2) {
			ans += a[root];
		}
		else ans += max(0ll,a[root] + mmax[1]);
		return 0;
	}
	if (mx < a[u]) {
		ans += a[u] - mx;
		mx = a[u];
	}
	
	return mx;
}
void solve(){
	cin >> N;
	memset(h,-1,sizeof(int)*(N+10));
	for (int i = 1; i <= N; i ++) cin >> a[i];
		
	for (int i = 1; i < N; i ++) {
		int u, v;
		cin >> u >> v;
		add(u, v);
		add(v, u);
	}

	
	for (int i = 2; i <= N; i ++) {
		if (a[i] > a[root]) {
			root = i;
		}
	}
	
	dfs(root,-1);	
	cout << ans << endl;

}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```
# C - Werewolves
### **题意**
给你一棵树，每个点都有一个颜色，问你某种颜色数量**严格大于联通块大小一半**的联通块数量。

### **思路**
- 数量严格大于大小的一半，说明每个合法的联通块都对应着一个颜色，那么我们可以枚举颜色，把每种颜色的合法联通块累加起来就是总的答案。
- 对于一个颜色color，我们把颜色是color的权值设为1，不同的设为-1，这样就把问题转化为总的权值大于0的联通块个数，就是一个树上背包问题。
- 普通的树上背包复杂度是O(N2),再加上颜色数最后是O(N3)。但是有些状态我们是不需要枚举的，就是权值和的范围最大是[-cnt[color],cnt[color]]，这样复杂度分摊是O(N2)
- 权值有负的，我们可以加上一个偏移值base

### **代码**
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define error(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

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
const int mod = 998244353;
const double eps = 1e-6;
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};


int T = 1,N,M,K,Q;

vector<int> G[3030];
void add(int a, int b) {
	G[a].push_back(b);
}


vector<vector<int>> dp(3010,vector<int>(6010));
vector<int> a(3030), siz(3007), f(6060);
vector<int> num(3030);


int color;
int ans = 0;
int base = 3005;
void dfs(int u, int fa) {
	siz[u] = 1;
	if (color == a[u]) dp[u][base+1] = 1;
	else dp[u][base - 1] = 1;
	
	
	for (int j : G[u]) {
		if (j == fa) continue;
		dfs(j, u);
		int bro1 = min(siz[u], num[color]);//之前枚举过的子树
		int bro2 = min(siz[j], num[color]);//当前子树
		for (int x = -bro1; x <= bro1; x ++) {
			f[x + base] = dp[u][x + base];
		}
		//当前子树和之前的子树配对（方案相乘）
		for (int x = -bro1; x <= bro1; x ++) {
			for (int y = -bro2; y <= bro2; y ++) {
				(dp[u][x + y + base] += dp[j][y + base] * f[x + base]) %= mod;
			}
		}
		
		siz[u] += siz[j];
	}
	
	for (int i = 1; i <= num[color]; i ++) {//累加颜色为color，祖先是u的合法联通块
		(ans += dp[u][i + base]) %= mod;
	}
}
void solve(){
	
	
	cin >> N;
	
	for (int i = 1; i <= N; i ++) cin >> a[i], num[a[i]] ++;
		
	for (int i = 1; i < N; i ++) {
		int u, v;
		cin >> u >> v;
		add(u, v);
		add(v, u);
	}
	
	for (int i = 1; i <= N; i ++) {
		if (num[i] == 0) continue;
		//清空初始化
		for (int u = 1; u <= N; u ++ ) 
			for (int j = -num[i]; j <= num[i]; j ++)
            	dp[u][j + base] = 0;
		color = i;
		dfs(1, -1);

	}	

	cout << ans << endl;

}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```
# D - Paint
### 题意
给你N个数，每次你能选择数值相同的一段把它变成另外一个数值，问把这N个数全部变成一个颜色需要多少次操作。

### 思路
首先我们把原数组相邻的相同元素进行压缩，压缩后有M个元素

那么我们最多只需要M-1次操作之后所有元素值相同

对于abc当a=c（两端相等）时我们可以减少一次操作

我们定义dp[i][j]代表区间[i,j]最多可以减少几次操作，那么最后答案就是M-1-dp[1][M]

转移方程dp[i][j] = dp[i][j-1],dp[i][j] = max(dp[i][j], dp[i][k]+dp[k+1][j-1]+1),k满足k>=i，且a[k]==a[j].对于k直接枚举区间[i,j]会超时，题目保证每个数最多出现20次，我们只需要预处理出上一个等于a[i]的位置的pre[i]就能保证k最多枚举20次，复杂度为20*N*N。

### 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define error(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

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
	
	cin >> N;
	
	vector<int> a(N + 1),nxt(N+1), b;
	b.push_back(0);
	for (int i = 1; i <= N; i ++) {
		cin >> a[i];
		if (i > 1 && a[i] != a[i-1]) {
			b.push_back(a[i-1]);
		}
	}
	b.push_back(a[N]);
	M = b.size() - 1;
	
	
	vector<int> pre(N+10), st(N+10);
	for (int i = 1; i <= M; i ++) {
		if (!st[b[i]]) {
			pre[i] = 0;
			st[b[i]] = i;
		} else {
			pre[i] = st[b[i]];
			st[b[i]] = i;
		}
	}
	vector<vector<int>>dp(N+1,vector<int>(N+1));
	
	for (int len = 2; len <= M; len ++) {
		for (int i = 1; i + len - 1 <= M; i ++) {
			int j = i + len - 1;
			if (len == 2) {
				if (b[i] == b[j]) dp[i][j] = 1;
				else dp[i][j] = 0;
			} else {
				dp[i][j] = dp[i][j-1];
				
				int x = pre[j];
				while (x >= i) {
					dp[i][j] = max(dp[i][j], dp[i][x] + dp[x + 1][j - 1] + 1);
					x = pre[x];
				}
				
			}
		}
	}
	cout << M - 1 - dp[1][M] << endl;
	
	


}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

# E - Outer space invaders
### 思路
有N个敌人，每个人出现的时间是a[i]到b[i],出现的位置在d[i]，你只能在原点放置炸弹，威力为r的炸弹需要r花费，能炸到[-r,r]，问消灭所有敌人的最小花费。

### 题解
对于每个敌人我们可以表示成一个平行于x轴的线段，高度为d，这样题目就变成了最少需要多长的竖直线段，能穿过所有线段。
![image.png](/upload/2022/03/image-1a16ab2bb9ff440b8f87d5a6bcb0df14.png)

- 首先，对于最高的线段，必然有一条红线等于它的高度来消灭它，在消灭它的同时可以借机消灭其他较矮的线段。
- dp[i][j]代表消灭区间[i,j]内的所有敌人所需要最小花费。
- 我们找到当前区间的d最大的线段，然后枚举线段上的每一点i，把区间分为了两部分[l,i-1]和[i+1,r]。
- 如果线段不是真包涵于当前区间，说明它被某个区间的分界线隔断了，而区间的分界线就是有炸弹的时刻。
- dp[l][r] = min(dp[l][i-1] + dp[i+1][r]) + d[i]

### 代码
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f
#define int long long
#define endl "\n"


#define error(args...) { string _s = #args; replace(_s.begin(), _s.end(), ',', ' '); stringstream _ss(_s); istream_iterator<string> _it(_ss); err(_it, args); }

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

vector<int> a(maxn), b(maxn), d(maxn);
vector<vector<int>> dp(1010,vector<int>(1010));
int dfs(int l, int r) {
	if (l > r) return 0;
	if (dp[l][r] != -1) return dp[l][r];
	int &ans = dp[l][r];
	ans = INF;
	pair<int,int> mx = {-1,-1};
	for (int i = 1; i <= N; i ++) {
		if (a[i] >= l && b[i] <= r) {
			if (d[i] > mx.first) {
				mx = {d[i], i};
			}
		}
	}
	
	if (mx.first == -1) return ans = 0;
	
	for (int i = a[mx.second]; i <= b[mx.second]; i ++) {
		ans = min(ans, dfs(l,i-1) + dfs(i+1,r));
	}
	ans += mx.first;
	return ans;
}
void solve(){
	
	cin >> N;
	vector<int> v;	
	for (int i = 1; i <= N; i ++) {
		cin >> a[i] >> b[i] >> d[i];
		v.push_back(a[i]);
		v.push_back(b[i]);
	}
	
	sort(v.begin(),v.end());
	v.erase(unique(v.begin(),v.end()),v.end());
	M = v.size();
	
	
	for (int i = 1; i <= N; i ++) {
		a[i] = lower_bound(v.begin(),v.end(),a[i]) - v.begin() + 1;
		b[i] = lower_bound(v.begin(),v.end(),b[i]) - v.begin() + 1;
	}
	
	
	
	for (int i = 1; i <= M; i ++) 
		for (int j = 1; j <= M; j ++)
			dp[i][j] = -1;
	
	
	
	cout << dfs(1,M) << endl;
	


}
signed main()
{
	cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```

