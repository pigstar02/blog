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
pubDate: 2022-02-27 22:39:37.791000
tags:
- ACM
- ICPC
- 题解
theme: light
title: namomo每日一题week1-day2 - daimayuanoj437. no crossing
---

# no crossing[传送门](http://oj.daimayuan.top/problem/437)

**题意：** 给你一个有向图，但是不用把它看成一个图，就看成数轴上的点，某些点之间有连边，注意是有向边。这样子限制条件就变成了如果这条边的中间某个点已经走过则无法选择这条边包括左右端点。在限制下求刚好经过K个点的所有路径中的最短路，如果不存在这样的最短路则输出-1.

# **思路1 - 区间DP**
首先，后续每一步的区间是逐渐减小的，那么我们反着思考倒着走，那么已走的区间是不断扩大的。假如最后一步是2 -> 3,那么倒数第二步一定是a -> 2，a属于[1,2)和(3,N]，只有这样才符合限制。如果a属于[2,3]，那么最后一步2 -> 3经过a不符合限制。
- 我们定义dp[l][r][step][type]代表当前走过的点的左右边界（最小值，最大值），已经走了几步，当前停留在l还是r，0在l，1在r。
- 当我们倒着走时，新加入的点一定是会更新左右边界的，也就是说我们总是停在左右边界其中一个上。


**具体看代码**


**代码**
```cpp
#include<bits/stdc++.h>
using namespace std;

#define INF 0x3f3f3f3f


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
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

int ans = 1e9;

int dp[102][102][102][2];
int mp[102][102];


void solve(){
	
	memset(dp,0x3f,sizeof(dp));
	memset(mp,0x3f,sizeof(mp));
	cin >> N >> K >> M;
	for (int i = 0; i < M; i ++) {
		int a, b, c;
		cin >> a >> b >> c;
		mp[a][b] = min(mp[a][b], c);
	}
	
	for (int i = 1; i <= N; i ++) 
		dp[i][i][1][0] = dp[i][i][1][1] = 0;//只有一个点没有边答案是0
		
		
	for (int step = 2; step <= K; step ++) { //步数是一步步增加的放最外面
		for (int len = 1; len <= N; len ++) {
			for (int i = 1; i + len - 1 <= N; i ++) {
				int j = i + len - 1;//[i,j]枚举区间
		 		for (int k = 1; k < i; k ++) {//k在i左边
		 			//k -> i -> j
		 			if (mp[k][i] != INF) dp[k][j][step][0] = min(dp[k][j][step][0], dp[i][j][step-1][0] + mp[k][i]);
		 			//k -> j -> i
		 			if (mp[k][j] != INF) dp[k][j][step][0] = min(dp[k][j][step][0], dp[i][j][step-1][1] + mp[k][j]);
				}
				
				for (int k = j + 1; k <= N; k ++) {//k在右边
					//k -> i -> j
					if (mp[k][i] != INF) dp[i][k][step][1] = min(dp[i][k][step][1], dp[i][j][step-1][0] + mp[k][i]);
					//k -> j -> i
					if (mp[k][j] != INF) dp[i][k][step][1] = min(dp[i][k][step][1], dp[i][j][step-1][1] + mp[k][j]);
				}
			}
		}
	}
	
	for (int i = 1; i <= N; i ++) {
		for (int j = 1; j <= N; j ++) {//枚举所有区间
			int t = min(dp[i][j][K][0],dp[i][j][K][1]);//刚好走了K步
			ans = min(ans, t);
		}
	}
	
	cout << (ans == 1e9 ? -1 : ans) << endl;



}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 
```




# **思路2 - 记忆化搜索**
记忆化搜索的话我们就可以正着思考了（比较容易理清），先枚举所有点作为起点起点。若当前走了now这个点，那么下一个点可以是[l+1,now-1]和[now+1,r-1]。l是走过的点中小于now的最大的点，r是走过的点中大于now的最小的点。然后继续搜索，同时更新步数和l，r，当已经K步后返回一个0。

就像上面所说的，我们的每走完一步都会更新边界，也就是now就是其中一个边界，这样我们就可以优化掉其中一个边界。

- dp[now][go][step]表示当前选了now，下一步另一个边界为go，还需要走step个点

**代码**
```cpp
#include<bits/stdc++.h>
using namespace std;


#define INF 0x3f3f3f3f3f3f3f3f


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
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int T = 1,N,M,K,Q;

int ans = 1e9;

int dp[102][102][102];
int mp[102][102];

int dfs(int now, int go, int cnt) {
	if (~dp[now][go][cnt]) return  dp[now][go][cnt];//记忆化
	
	if (!cnt) {
		return dp[now][go][cnt] = 0;//已经K个点了
	}
	dp[now][go][cnt] = 1e9;//初始化为最大值

	for (int i = min(now,go) + 1; i < max(now,go); i ++) {//枚举可以走的点
		int w = mp[now][i];
		dp[now][go][cnt] = min({dp[now][go][cnt],min(dfs(i,now,cnt-1),dfs(i,go,cnt-1)) + w});//继续搜索
	}
	return dp[now][go][cnt];
}
void solve(){
	
	memset(dp,-1,sizeof(dp));
	memset(mp,0x3f,sizeof(mp));
	cin >> N >> K >> M;
	for (int i = 0; i < M; i ++) {
		int a, b, c;
		cin >> a >> b >> c;
		mp[a][b] = min(mp[a][b], c);
	}
	
	for (int i = 1; i <= N; i ++) {//枚举起点
		ans = min({ans,dfs(i,0,K-1),dfs(i,N+1,K-1)});
	}
	
	if (ans == 1e9) cout << -1 << endl;
	else cout << ans << endl;
	
	



}
signed main()
{
	ios::sync_with_stdio(false);cin.tie(0);
	
	// cin >> T;
	for (int i = 1; i <= T; i ++) solve();
    return (0-0); //<3
} 

```
