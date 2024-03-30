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
pubDate: 2022-04-13 15:32:12
tags:
- ACM
- ICPC
- 题解
theme: light
title: template
---

# STL简介

``` cpp
vector, 变长数组，倍增的思想
    size()  返回元素个数
    empty()  返回是否为空
    clear()  清空
    front()/back()
    push_back()/pop_back()
    begin()/end()
    []
    支持比较运算，按字典序

pair<int, int>
    first, 第一个元素
    second, 第二个元素
    支持比较运算，以first为第一关键字，以second为第二关键字（字典序）

string，字符串
    size()/length()  返回字符串长度
    empty()
    clear()
    substr(起始下标，(子串长度))  返回子串
    c_str()  返回字符串所在字符数组的起始地址

queue, 队列
    size()
    empty()
    push()  向队尾插入一个元素
    front()  返回队头元素
    back()  返回队尾元素
    pop()  弹出队头元素

priority_queue, 优先队列，默认是大根堆
    size()
    empty()
    push()  插入一个元素
    top()  返回堆顶元素
    pop()  弹出堆顶元素
    定义成小根堆的方式：priority_queue<int, vector<int>, greater<int>> q;

stack, 栈
    size()
    empty()
    push()  向栈顶插入一个元素
    top()  返回栈顶元素
    pop()  弹出栈顶元素

deque, 双端队列
    size()
    empty()
    clear()
    front()/back()
    push_back()/pop_back()
    push_front()/pop_front()
    begin()/end()
    []

set, map, multiset, multimap, 基于平衡二叉树（红黑树），动态维护有序序列
    size()
    empty()
    clear()
    begin()/end()
    ++, -- 返回前驱和后继，时间复杂度 O(logn)

    set/multiset
        insert()  插入一个数
        find()  查找一个数
        count()  返回某一个数的个数
        erase()
            (1) 输入是一个数x，删除所有x   O(k + logn)
            (2) 输入一个迭代器，删除这个迭代器
        lower_bound()/upper_bound()
            lower_bound(x)  返回大于等于x的最小的数的迭代器
            upper_bound(x)  返回大于x的最小的数的迭代器
    map/multimap
        insert()  插入的数是一个pair
        erase()  输入的参数是pair或者迭代器
        find()
        []  注意multimap不支持此操作。 时间复杂度是 O(logn)
        lower_bound()/upper_bound()

unordered_set, unordered_map, unordered_multiset, unordered_multimap, 哈希表
    和上面类似，增删改查的时间复杂度是 O(1)
    不支持 lower_bound()/upper_bound()， 迭代器的++，--

bitset, 圧位
    bitset<10000> s;
    ~, &, |, ^
    >>, <<
    ==, !=
    []

    count()  返回有多少个1

    any()  判断是否至少有一个1
    none()  判断是否全为0

    set()  把所有位置成1
    set(k, v)  将第k位变成v
    reset()  把所有位变成0
    flip()  等价于~
    flip(k) 把第k位取反

```



# log预处理

$$
\left\{\begin{aligned} Logn[1] &=0, \\ Logn\left[i\right] &=Logn[\frac{i}{2}] + 1. \end{aligned}\right.
$$

```cpp
void getlog(){//预处理Log数组
	Log[1] = 0;
	for(int i = 2; i <= n; i ++){
		Log[i] = Log[i/2]+1;
	}
}
```



# ST表

**用处：**

静态区间最大值，最小值，gcd（可重复贡献的问题）除 RMQ 以外，还有其它的“可重复贡献问题”。例如“区间按位和”、“区间按位或”、“区间 GCD”，ST 表都能高效地解决。例如“区间按位与”就是每一位取最小值，“区间按位或”就是每一位取最大值，而“区间 GCD”则是每一个质因数的指数取最小值。

```cpp
int n,m;
int a[N];//静态数组
int Log[N];//log(i)的值
int dp[N][20];//区间【i，i+(2^j)-1】里的信息（最值，gcd等）
void getlog(){//预处理Log数组
	Log[1] = 0;
	for(int i = 2; i <= n; i ++){
		Log[i] = Log[i/2]+1;
	}
}

void RMQ(){
	for(int j = 1; (1<<j)<= n; j ++){
		for(int i = 1; i+(1<<j)-1 <= n; i++){
      //由原来两半得到合并后长度的信息（类似区间dp）
			dp[i][j] = max(dp[i][j-1],dp[i+(1<<(j-1))][j-1]);
		}
	}
}
void solve()
{
    cin >> n >> m;
    for(int i = 1; i <= n; i ++){
    	cin >> a[i];
    	dp[i][0] = a[i];//区间长度为1时就是自己
    }
    getlog();
    RMQ();
    while(m--){
    	int l,r;
    	cin >> l >> r;
    	int e = Log[r-l+1];
      //从前2^e和从后2^e囊括了整个区间
    	cout << max(dp[l][e],dp[r-(1<<e)+1][e]) << endl;
    }
}
int main()
{
    cin.tie(0);
    cout.tie(0);
    ios_base::sync_with_stdio(0);
    int T = 1;
    // cin >> T;
    while(T--)
    {
        solve();
    }
    return 0;
} 
```



# Lca

倍增法求公共祖先

**用处：**

1 -  求树上两点最短距离

```cpp
int n,m;
vector<int> g[N];//存图
int deep[N];//节点的深度
int pre[N][64];//i节点往上2^j层节点编号
void init(int u, int fa){
	deep[u] = deep[fa]+1;//深度是父节点深度+1
	pre[u][0] = fa;//往上2^0=1层就是父节点
	
  //往上2^j层是往上2^(j-1)后再往上2^(j-1)层
	for(int j = 1; (1<<j) <= deep[u]; j ++){
		pre[u][j] = pre[pre[u][j-1]][j-1];
	}
	
	for(int i = 0; i < g[u].size(); i++){
		if(g[u][i]==fa) continue;//不能往回走
		init(g[u][i],u);//dfs递归
	}
}

int lca(int u,int v){
	if(deep[u] < deep[v]) swap(u,v);//保证u的深度>=v的深度
	int d = deep[u] - deep[v];//深度差
	for(int i = 0; (1<<i) <= d; i ++){//将深度差转化成2进制
		if((1<<i)&d) u = pre[u][i];//第i位是1说明d由2^i累加
	}
	if(u==v) return u;//已经相等了，直接返回（v，u同一条链）
	
	for(int i = 63; i >= 0; i --){//u，v同时往上跳
    //公共祖先及以上是相等，可能跳过，所以用不相等判断
		if(pre[u][i]!=pre[v][i]){//还没跳到公共祖先
			u = pre[u][i];
			v = pre[v][i];
		}
	}
	//结束后是公共祖先的子节点	
	return pre[u][0];
}
```



# 悬线法

求最大子矩阵（要求每个矩阵底边在同一行）

![iShot2021-10-20 17.08.50.png](https://cdn.jsdelivr.net/gh/zhujuqiang/blog_img/jVqWdfCBgI21TbK.png)

```cpp
#include <algorithm>
#include <cstdio>
using std::max;
const int N = 100010;
int n, a[N];
int l[N], r[N];
long long ans;
int main() {
  while (scanf("%d", &n) != EOF && n) {
    ans = 0;
    //a[i]是每一列的高度， l[i],r[i]分别指以a[i]为高的矩阵的左边界和右边界
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]), l[i] = r[i] = i;
    for (int i = 1; i <= n; i++)//l[i]--i是单调减的
      while (l[i] > 1 && a[i] <= a[l[i] - 1]) l[i] = l[l[i] - 1];//计算左边界
    for (int i = n; i >= 1; i--)//i--r[i]i是单调增的
      while (r[i] < n && a[i] <= a[r[i] + 1]) r[i] = r[r[i] + 1];//计算右边界
    for (int i = 1; i <= n; i++)//枚举取Max
      ans = max(ans, (long long)(r[i] - l[i] + 1) * a[i]);
    printf("%lld\n", ans);
  }
  return 0;
}
```



#### [2021杭电多校第一场	Maximal submatrix](https://acm.hdu.edu.cn/showproblem.php?pid=6957)

枚举每一行为底边就转化成上述的子问题

```cpp
const int N = 2e3+7;

int n,m;
int a[N][N], g[N][N], l[N], r[N], h[N];
void solve()
{
    cin >> n >> m;
    memset(a,0,sizeof a);
    memset(g,0,sizeof g);
    for(int i = 1; i <= n; i ++){
    	for(int j = 1; j <= m; j ++){
    		cin >> a[i][j];
    	}
    }
    for(int i = 1; i <= m; i ++){
    	int t = 1, x = 1;
    	while(t<=n){
    		x = 1-x;
    		while(a[t][i]<=a[t+1][i]){
    			g[t][i] = x;
    			t++;
    			//if(t>n) break;
    		}
    		g[t][i] = x;
    		t++;
    	}
    }
    
     for(int i = 1; i <= m; i ++) h[i] = 0;
    int ans = 0;
    for(int i = 1; i <= n; i ++){
    	for(int j = 1; j <= m; j ++) l[j] = r[j] = j;
    	for(int j = 1; j <= m; j ++){
    		if(g[i][j]==g[i-1][j]){
    			h[j]++;
    		}
    		else{
    			h[j] = 1;
    		}
    	}
    	
    	for(int j = 1; j <= m; j ++){
    		while(l[j]>1 && h[j]<=h[l[j]-1]) l[j] = l[l[j]-1];
    	}
    	for(int j = m; j >= 1; j --){
    		while(r[j]<m && h[j]<=h[r[j]+1]) r[j] = r[r[j]+1];
    	}
    	
    	for(int j = 1; j <= m; j ++) {
    		ans = max(ans, h[j]*(r[j]-l[j]+1));
    	}
    }
    cout << ans << endl;
}
int main()
{
    cin.tie(0);
    cout.tie(0);
    ios_base::sync_with_stdio(0);
    int T = 1;
    cin >> T;
    while(T--)
    {
        solve();
    }
    return 0;
} 
```



# BSGS

用于求解下述式子

![](https://cdn.jsdelivr.net/gh/zhujuqiang/blog_img/20220420231215.png)

**算法描述**

令 $ x = A \left \lceil \sqrt p \right \rceil - B $，其中 $0\le A,B \le \left \lceil \sqrt p \right \rceil$，则有 $a^{A\left \lceil \sqrt p \right \rceil -B} \equiv b \pmod p$，稍加变换，则有 $a^{A\left \lceil \sqrt p \right \rceil} \equiv ba^B \pmod p$。

我们已知的是 $a,b$，所以我们可以先算出等式右边的 $ba^B$的所有取值，枚举 $B$，用 `hash`/`map` 存下来，然后逐一计算 $a^{A\left \lceil \sqrt p \right \rceil}$，枚举 $A$，寻找是否有与之相等的 $ba^B$，从而我们可以得到所有的 $x$，$x=A \left \lceil \sqrt p \right \rceil - B$。

注意到 $A,B$ 均小于 $\left \lceil \sqrt p \right \rceil$，所以时间复杂度为 $\Theta\left (\sqrt p\right )$，用 `map` 则多一个 $log$。



**工具**

1. map哈希
2. 分块



#### 简单计算机（模板题）

```cpp
void bsgs(ll a, ll b, ll p){
  //特判a==0的情况
	if(a==0&&b!=0){
		printf("Orz, I cannot find x!\n");
		return;
	}
	if(a==0&&b==0){
		puts("1");
		return;
	}
	ll m = ceil(sqrt(p));//分块
	unordered_map<ll,ll> dis;//记录  dis[(b*a^B)%p] = B
	
	ll temp = b%p;
	dis[temp] = 0;
	for(int i = 1; i <= m; i ++){
		temp = (temp*a)%p;
		dis[temp] = i;//预处理dis
	}

	ll t = qmi(a,m,p);
	temp = 1;
	for(int i = 1; i <= m; i ++){
		temp = (temp*t)%p;
		if(dis[temp]){
			ll x =i*m-dis[temp];//计算x
			x = (x%p+p)%p;//可能变负数，取正
			printf("%lld\n",x);
			return;
		}
	}
	puts("Orz, I cannot find x!");//无解
	return;
}
```

# 点分治

用分治思想处理树上的一些问题，即根节点信息可以由所有子节点的信息推出

> 求树上长度等于k的路径有几条

**第一步：求出树的重心**

```cpp
void getroot(int x, int pre) //siz:树的大小,mx:子树中size的最大值,root树的重心
{
  siz[x] = 1;//当前节点大小为1
  for(int i = h[x]; i!=-1; i = ne[i])
  {
    if(to[i]!=pre)//不能往回走，所以到父亲节点时跳过
    {
      getroot(to[i],x);//递归求子树
      siz[x] += size[to[i]];
      mx[x] = max(mx[x], size[to[i]]);
    }
  }
  mx[x] = max(mx[x], n-siz[x]);
  if(mx[x]<mx[root]) root = x;
}
```

**第二步：以新的root为根**







# 扫描线

顾名思义，一条线在整个图上扫来扫去。



**模型：**在二维坐标系上，给出多个矩形的左下以及右上坐标，求出所有矩形构成的图形的面积。它一般被用来解决图形面积，周长等问题。



**思路：**

![](https://cdn.jsdelivr.net/gh/zhujuqiang/blog_img/20220420231518.png)

- 如图所示，我们可以按照每一种y画一条横线（这就是扫描线），把整个矩形分成如图各个颜色不同的小矩形，那么这个小矩形的高就是我们扫过的距离，那么剩下了一个变量，那就是矩形的长一直在变化（若干个区间并集的长度）。
- 我们的线段树就是为了维护矩形的长，我们给每一个矩形的上下边进行标记，下面的边标记为 1，上面的边标记为 -1，每遇到一个矩形时，我们知道了标记为 1 的边，我们就加进来这一条矩形的长，等到扫描到 -1 时，证明这一条边需要删除，就删去，利用 1 和 -1 可以轻松的到这种状态。（最后标记大于0的集合就是区间并集，也就是长）
- 还要注意这里的线段树指的并不是线段的一个端点，而指的是一个区间，所以我们要计算的是r+1和r-1 。
- 需要 离散化

#### 模板：[牛客多校6H_Hopping Rabbit](https://ac.nowcoder.com/acm/contest/11257/H)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+5;
struct A{
	int yl,yr;//	矩形左边界，右边界
};
struct Seg{//		存储线段信息
	int mi[N*4],lazy[N*4]；
  int L,R,W;	//左端点，右端点，修改的值
	void update(int x){
		mi[x]=min(mi[x<<1],mi[x<<1|1]);
	}
	void pushdown(int x){
		if(lazy[x]){
			lazy[x<<1]+=lazy[x],mi[x<<1]+=lazy[x];
			lazy[x<<1|1]+=lazy[x],mi[x<<1|1]+=lazy[x];
			lazy[x]=0;
		}
	}
	void change(int x,int l,int r){
		if(l>=L&&r<=R){mi[x]+=W,lazy[x]+=W;return;}
		pushdown(x);
		int mid=(l+r)>>1;
		if(L<=mid)change(x<<1,l,mid);
		if(R>mid)change(x<<1|1,mid+1,r);
		update(x);
	}
	int query(int x,int l,int r){
		if(l==r)return l;
		int mid=(l+r)>>1;pushdown(x);
		if(!mi[x<<1])return query(x<<1,l,mid);
		else return query(x<<1|1,mid+1,r);
	}
	int query1(int n){
		if(mi[1])return -1;
		return query(1,1,n)-1;
	}
}S;
vector<A> V[N],V1[N];
int n,d;
void cal(int &x){
	x=(x%d+d)%d;
}
void op1(int x1,int x2,int y1,int y2){
	if(x1>=x2||y1>=y2)return;
	V[x1].push_back(A{y1+1,y2});
	V1[x2].push_back(A{y1+1,y2});
}
void op(int x1,int x2,int y1,int y2){
	if(y2-y1>=d){op1(x1,x2,0,d);return;}
	cal(y1),cal(y2);
	if(y1>y2){op1(x1,x2,y1,d),op1(x1,x2,0,y2);}
	else op1(x1,x2,y1,y2);
}
int main(){
	int x1,y1,x2,y2;scanf("%d%d",&n,&d);
	for(int i=0;i<n;i++){
		scanf("%d%d%d%d",&x1,&y1,&x2,&y2);
    //取模离散化到小范围可能变成多个矩形
    //以下及op函数都在处理该问题
		if(x2-x1>=d){op(0,d,y1,y2);continue;}
		cal(x1),cal(x2);
		if(x1>x2){op(x1,d,y1,y2),op(0,x2,y1,y2);}
		else op(x1,x2,y1,y2);
	}
	for(int i=0;i<d;i++){//枚举每个（扫描）线
    //这条线上的区间变化后
		for(auto x:V[i])S.L=x.yl,S.R=x.yr,S.W=1,S.change(1,1,d);
		for(auto x:V1[i])S.L=x.yl,S.R=x.yr,S.W=-1,S.change(1,1,d);
		int y=S.query1(d);//区间最小值不为0，则区间全被覆盖
		if(y!=-1){printf("YES\n%d %d\n",i,y);return 0;}
	}
	puts("NO");
	return 0;
}
```

# 并查集

```cpp
(1)朴素并查集：

int p[N]; //存储每个点的祖宗节点

// 返回x的祖宗节点
int find(int x)
{
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

// 初始化，假定节点编号是1~n
for (int i = 1; i <= n; i ++ ) p[i] = i;

// 合并a和b所在的两个集合：
p[find(a)] = find(b);


(2)维护size的并查集：

int p[N], size[N];
//p[]存储每个点的祖宗节点, size[]只有祖宗节点的有意义，表示祖宗节点所在集合中的点的数量

// 返回x的祖宗节点
int find(int x)
{
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

// 初始化，假定节点编号是1~n
for (int i = 1; i <= n; i ++ )
{
    p[i] = i;
    size[i] = 1;
}

// 合并a和b所在的两个集合：
size[find(b)] += size[find(a)];
p[find(a)] = find(b);


(3)维护到祖宗节点距离的并查集：

int p[N], d[N];
//p[]存储每个点的祖宗节点, d[x]存储x到p[x]的距离

// 返回x的祖宗节点
int find(int x)
{
    if (p[x] != x)
    {
        int u = find(p[x]);
        d[x] += d[p[x]];
        p[x] = u;
    }
    return p[x];
}

// 初始化，假定节点编号是1~n
for (int i = 1; i <= n; i ++ )
{
    p[i] = i;
    d[i] = 0;
}

// 合并a和b所在的两个集合：
p[find(a)] = find(b);
d[find(a)] = distance; // 根据具体问题，初始化find(a)的偏移量

```



# 单调栈

满足单调性的栈

**[模板题](https://www.luogu.com.cn/problem/P5788)**

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
#include <algorithm>

using namespace std;

#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ll long long
#define ull unsigned long long
#define ft first
#define sd second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF_INT 0x3f3f3f3f
#define debug(a) cout<<#a<<"="<<a<<endl;


// inline void print(__int128 x){if(x<0){putchar('-');x=-x;}if(x>9) print(x/10);putchar(x%10+'0');}
int gcd(int a, int b){return b ? gcd(b, a % b) : a;}
int exgcd(int a, int b, int &x, int &y){if(!b){x = 1; y = 0;return a;}int d = exgcd(b, a % b, y, x);y -= (a/b) * x;return d;}
ll qmi(ll m, ll k, ll p){ll res = 1 % p, t = m;while (k){if (k&1) res = res * t % p;t = t * t % p;k >>= 1;}return res;}


const int N = 3e6+7;

int n,m;
struct node{
    int v,pos,idx;
}a[N];
void solve()
{
    scanf("%d",&n);
    for(int i = 1; i <= n; i ++) {scanf("%d",&a[i].v);a[i].idx = i;}
    stack<node> s;
    for(int i = 1; i <= n; i ++){
        if(i==1){
            s.push(a[i]);
            continue;
        }
        int now = a[i].v;
        auto t = s.top();
        while(now>t.v){
            a[t.idx].pos = i;
            s.pop();
            if(s.empty()) break;
            t = s.top();
        }
        s.push(a[i]);
    }
    
    for(int i = 1; i <= n; i ++){
        cout << a[i].pos << " ";
    }
}
int main()
{
    cin.tie(0);
    cout.tie(0);
    ios_base::sync_with_stdio(0);
    int T = 1;
    //cin >> T;
    while(T--)
    {
        solve();
    }
    return 0;
} 
```



# __int128读写模板子

```cpp
inline __int128 read(){
    __int128 x=0,f=1;
    char ch=getchar();
    while(ch<'0'||ch>'9'){
        if(ch=='-')
            f=-1;
        ch=getchar();
    }
    while(ch>='0'&&ch<='9'){
        x=x*10+ch-'0';
        ch=getchar();
    }
    return x*f;
}
 
inline void print(__int128 x){
    if(x<0){
        putchar('-');
        x=-x;
    }
    if(x>9)
        print(x/10);
    putchar(x%10+'0');
}

```



# 树状数组

```cpp
int lowbit(int x)
{
	return x&-x;
}
void modify(int x,int c)//修改树状数组x位置的值
{
	for(int i=x;i<=n;i+=lowbit(i)) tr[i]+=c;
}
int query(int x)//查询区间1~x的区间和；
{
	int res=0;
	for(int i=x;i>=1;i-=lowbit(i)) res+=tr[i];
	return res; 
}
```

# 二维树状数组

详情讲解 https://www.cnblogs.com/hbhszxyb/p/14157271.html

单点修改，区间查询

```cpp
#include <bits/stdc++.h>
const int maxn=4096+5;
typedef long long ll;
ll c[maxn][maxn];
int n,m;
int lowbit(int x){return x & -x;}
void modify(int x,int y,int z){//点(x,y)增加z 
    for(int i=x;i<=n;i+=lowbit(i))
        for(int j=y;j<=m;j+=lowbit(j))
            c[i][j]+=z;
}
ll getsum(int x,int y){//求左上角为(1,1)右下角为(x,y) 的矩阵和
    ll tot=0;
    for(int i=x;i;i-=lowbit(i))
        for(int j=y;j;j-=lowbit(j))
            tot+=c[i][j];
    return tot;
}
void Solve(){
    scanf("%d%d",&n,&m);
    int ch;
    while(~scanf("%d",&ch)){
        if(ch==1){
            int x,y,k;
            scanf("%d%d%d",&x,&y,&k);
            modify(x,y,k);
        }
        else{
            int a,b,c,d;
            scanf("%d%d%d%d",&a,&b,&c,&d);
            printf("%lld\n",getsum(c,d)-getsum(c,b-1)-getsum(a-1,d)+getsum(a-1,b-1));
        }
    }
}
int main(){
    Solve();
    return 0;
}

```

区间修改，单点查询

```cpp
#include <bits/stdc++.h>
const int maxn=4096+5;
typedef long long ll;
ll c[maxn][maxn];
int n,m;
int lowbit(int x){return x & -x;}
void modify(int x,int y,int z){//点(x,y)增加z 
    for(int i=x;i<=n;i+=lowbit(i))
        for(int j=y;j<=m;j+=lowbit(j)){
            c[i][j]+=z;
        }
}
ll getsum(int x,int y){
    ll tot=0;
    for(int i=x;i;i-=lowbit(i))
        for(int j=y;j;j-=lowbit(j))
            tot+=c[i][j];
    return tot;
}
void Solve(){
    scanf("%d%d",&n,&m);
    int ch;
    while(~scanf("%d",&ch)){
        if(ch==1){
            int x1,x2,y1,y2,k;//左上角(a,b),右下角(c,d)，增加k
            scanf("%d%d%d%d%d",&x1,&y1,&x2,&y2,&k);
            modify(x1,y1,k);
            modify(x2+1,y2+1,k);
            modify(x2+1,y1,-k);
            modify(x1,y2+1,-k);
        }
        else{
            int x,y;
            scanf("%d%d",&x,&y);
            printf("%lld\n",getsum(x,y));
        }
    }
}
int main(){
    Solve();
    return 0;
}

```

区间修改，区间查询

```cpp
#include <bits/stdc++.h>
const int maxn=2048+5;
typedef long long ll;
ll c1[maxn][maxn],c2[maxn][maxn],c3[maxn][maxn],c4[maxn][maxn];
int n,m;
int lowbit(int x){return x & -x;}
void modify(ll x,ll y,ll z){//点(x,y)增加z 
    for(int i=x;i<=n;i+=lowbit(i))
        for(int j=y;j<=m;j+=lowbit(j)){
            c1[i][j]+=z;
            c2[i][j]+=x*z;
            c3[i][j]+=y*z;
            c4[i][j]+=x*y*z;
        }
}
ll getsum(ll x,ll y){
    ll tot=0;
    for(int i=x;i;i-=lowbit(i))
        for(int j=y;j;j-=lowbit(j))
            tot+=(x+1)*(y+1)*c1[i][j]-(y+1)*c2[i][j]-(x+1)*c3[i][j]+c4[i][j];
    return tot;
}
void Solve(){
    scanf("%d%d",&n,&m);
    int ch;
    while(~scanf("%d",&ch)){
        if(ch==1){
            int x1,x2,y1,y2;//左上角(a,b),右下角(c,d)，增加k
            ll k;
            scanf("%d%d%d%d%lld",&x1,&y1,&x2,&y2,&k);
            modify(x1,y1,k);
            modify(x2+1,y2+1,k);
            modify(x2+1,y1,-k);
            modify(x1,y2+1,-k);
        }
        else{
            int x1,y1,x2,y2;
            scanf("%d%d%d%d",&x1,&y1,&x2,&y2);
            printf("%lld\n",getsum(x2,y2)+getsum(x1-1,y1-1)-getsum(x2,y1-1)-getsum(x1-1,y2));
        }
    }
}
int main(){
    Solve();
    return 0;
}

```



# 树链剖分

#### 点权

基于点权，查询单点值，修改路径的上的点权(HDU 3966 树链剖分 + 树状数组)

```cpp
const int MAXN = 50010; 
struct Edge{
	int to,next; 
}edge[MAXN*2];
int head[MAXN],tot;
int top[MAXN];//top[v] 表示 v 所在的重链的顶端节点 int fa[MAXN];//父亲节点
int deep[MAXN];//深度
int num[MAXN];//num[v] 表示以 v 为根的子树的节点数 int p[MAXN];//p[v] 表示 v 对应的位置
int fp[MAXN];//fp 和 p 数组相反
int son[MAXN];//重儿子
int pos;
void init(){
	tot = 0; 
    memset(head,−1,sizeof(head));
	pos = 1;//使用树状数组，编号从头 1 开始 
    memset(son,−1,sizeof(son));
}
void addedge(int u,int v){
    edge[tot].to = v; edge[tot].next = head[u]; head[u] = tot++;
}
void dfs1(int u,int pre,int d){ 
    deep[u] = d;
    fa[u] = pre;
    num[u] = 1;
	for(int i = head[u];i != −1; i = edge[i].next){ 
        int v = edge[i].to;
		if(v != pre){
			dfs1(v,u,d+1);
            num[u] += num[v];
			if(son[u] == −1 || num[v] > num[son[u]])
				son[u] = v;
        }
    }
}
void getpos(int u,int sp){
    top[u] = sp;
    p[u] = pos++;
    fp[p[u]] = u;
    if(son[u] == −1) return; 
    getpos(son[u],sp);
	for(int i = head[u]; i != -1; i = edge[i].next){
        int v = edge[i].to;
        if(v != son[u] && v != fa[u]){
            getpos(v,v);
        }
    }
}
//树状数组
int lowbit(int x){
	return x&(−x); 
}
int c[MAXN];
int n;
int sum(int i){ 
    int s = 0; 
    while(i > 0){
		s += c[i];
		i −= lowbit(i); 
    }
	return s; 
}
void add(int i,int val){ 
    while(i <= n){
		c[i] += val;
        i += lowbit(i);
    }
}
//u->v 的路径上点的值改变 val
void Change(int u,int v,int val){
	int f1 = top[u], f2 = top[v]; 
    int tmp = 0;
	while(f1 != f2){
		if(deep[f1] < deep[f2]){ 
            swap(f1,f2);
			swap(u,v); 
        }
		add(p[f1],val); add(p[u]+1,−val); 
        u = fa[f1];
		f1 = top[u];
	}
	if(deep[u] > deep[v]) swap(u,v); 
    add(p[u],val); 
    add(p[v]+1,−val);
}
int a[MAXN];
int main(){ 
    int M,P;
	while(scanf("%d%d%d",&n,&M,&P) == 3){ 
        int u,v;
    	int C1,C2,K;
    	char op[10];
    	init();
        for(int i = 1;i <= n;i++){
            scanf("%d",&a[i]);
        }
        while(M−−){ 
            scanf("%d%d",&u,&v); 
            addedge(u,v); 
            addedge(v,u);
        }
        dfs1(1,0,0);
        getpos(1,1); 
        memset(c,0,sizeof(c)); 
        for(int i = 1;i <= n;i++){
            add(p[i],a[i]);
        	add(p[i]+1,−a[i]); 
        }
        while(P−−){ 
            scanf("%s",op);
        	if(op[0] == 'Q'){ 
                scanf("%d",&u);
                printf("%d\n",sum(p[u]));
            }
        	else{ 
                scanf("%d%d%d",&C1,&C2,&K); 
                if(op[0] == 'D'){
                    K = −K; 
                    Change(C1,C2,K);
                }
        	} 
        }
    }
    return 0; 
}
```

#### 边权

基于边权，修改单条边权，查询路径边权最大值(SPOJ QTREE 树链剖分 + 线段树)

```cpp
const int MAXN = 10010; 
struct Edge{
	int to,next; 
}edge[MAXN*2];
int head[MAXN],tot;
int top[MAXN];//top[v] 表示 v 所在的重链的顶端节点
int fa[MAXN]; //父亲节点
int deep[MAXN];//深度
int num[MAXN];//num[v] 表示以 v 为根的子树的节点数
int p[MAXN];//p[v] 表示 v 与其父亲节点的连边在线段树中的位置
int fp[MAXN];//和 p 数组相反 
int son[MAXN];//重儿子
int pos;
void init(){
	tot = 0; 
	memset(head,−1,sizeof(head)); 
	pos = 0; 
	memset(son,−1,sizeof(son));
}
void addedge(int u,int v){
    edge[tot].to = v;edge[tot].next = head[u];head[u] = tot++;
}
//第一遍 dfs 求出 fa,deep,num,son 
void dfs1(int u,int pre,int d){
	deep[u] = d; 
	fa[u] = pre; 
	num[u] = 1; 
	for(int i = head[u]; i != -1; i = edge[i].next){
		int v = edge[i].to;
		if(v != pre){
			dfs1(v,u,d+1);
            num[u] += num[v];
            if(son[u] == −1 || num[v] > num[son[u]])
            	son[u] = v;
		}
	}
}
//第二遍 dfs 求出top和p
void getpos(int u,int sp){
	top[u] = sp;
	p[u] = pos++;
	fp[p[u]] = u;
	if(son[u] == −1) return;
	getpos(son[u],sp);
	for(int i = head[u] ; i != −1; i = edge[i].next){
		int v = edge[i].to;
		if(v != son[u] && v != fa[u])
            getpos(v,v);
    }
}
//线段树 
struct Node{
	int l,r;
	int Max;
}segTree[MAXN*3];
void build(int i,int l,int r){
	segTree[i].l = l; segTree[i].r = r; 
	segTree[i].Max = 0; 
	if(l == r) return;
	int mid = (l+r)/2; 
	build(i<<1,l,mid); build((i<<1)|1,mid+1,r);
}
void push_up(int i){
    segTree[i].Max = max(segTree[i<<1].Max,segTree[(i<<1)|1].Max);
}
// 更新线段树的第 k 个值为 val
void update(int i,int k,int val){
	if(segTree[i].l == k && segTree[i].r == k){ 
		segTree[i].Max = val;
		return;
	}
	int mid = (segTree[i].l + segTree[i].r)/2; 
	if(k <= mid)update(i<<1,k,val);
	else update((i<<1)|1,k,val);
	push_up(i);
}
//查询线段树中 [l,r] 的最大值 
int query(int i,int l,int r){
    if(segTree[i].l == l && segTree[i].r == r) 
    	return segTree[i].Max;
    int mid = (segTree[i].l + segTree[i].r)/2;
    if(r <= mid) return query(i<<1,l,r);
    else if(l > mid) return query((i<<1)|1,l,r);
    else return max(query(i<<1,l,mid),query((i<<1)|1,mid+1,r));
}
//查询 u->v 边的最大值 
int find(int u,int v){
	int f1 = top[u], f2 = top[v]; 
	int tmp=0;
    while(f1 != f2){
    	if(deep[f1] < deep[f2]){ 
            swap(f1,f2);
            swap(u,v); 
        }
        tmp = max(tmp,query(1,p[f1],p[u]));
    	u= fa[f1]; 
    	f1 = top[u]; 
   	}
   	if(u == v) return temp;
   	if(deep[u] > deep[v]) swap(u,v);
	return max(tmp,query(1,p[son[u]],p[v]));
}

int e[MAXN][3]; 
int main(){
    int T;
    int n; 
    scanf("%d",&T); 
    while(T−−){
        init();
        scanf("%d",&n);
        for(int i = 0;i < n−1;i++){ 
            scanf("%d%d%d",&e[i][0],&e[i][1],&e[i][2]); 
            addedge(e[i][0],e[i][1]); 
            addedge(e[i][1],e[i][0]);
		}
        dfs1(1,0,0);
        getpos(1,1); 
        build(1,0,pos−1);
        for(int i = 0;i < n−1; i++){
            if(deep[e[i][0]] > deep[e[i][1]]) 
                swap(e[i][0],e[i][1]);
            update(1,p[e[i][1]],e[i][2]);
        }
		char op[10];
		int u,v; 
		while(scanf("%s",op) == 1){
			if(op[0] == 'D')break; 
			scanf("%d%d",&u,&v); 
			if(op[0] == 'Q')
				printf("%d\n",find(u,v));//查询 u->v 路径上边权的最大值
            else update(1,p[e[u−1][1]],v);//修改第 u 条边的长度为 v
		}
	}
	return 0;
}
```

# Manacher(马拉车)

**用处：**求字符串所有的回文子串长度（最大值）

p[i]代表以i为中心的回文串长度

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 2e7 + 10;

int n;
char a[N], b[N];
int p[N];

void init()
{
    int k = 0;
    b[k ++ ] = '$', b[k ++ ] = '#';
    for (int i = 0; i < n; i ++ ) b[k ++ ] = a[i], b[k ++ ] = '#';
    b[k ++ ] = '^';
    n = k;
}

void manacher()
{
    int mr = 0, mid;
    for (int i = 1; i < n; i ++ )
    {
        if (i < mr) p[i] = min(p[mid * 2 - i], mr - i);
        else p[i] = 1;
        while (b[i - p[i]] == b[i + p[i]]) p[i] ++ ;
        if (i + p[i] > mr)
        {
            mr = i + p[i];
            mid = i;
        }
    }
}

int main()
{
    scanf("%s", a);
    n = strlen(a);

    init();
    manacher();

    int res = 0;
    for (int i = 0; i < n; i ++ ) res = max(res, p[i]);
    printf("%d\n", res - 1);

    return 0;
}

```



# 链表

包含值域和指针域

#### 单向链表

```cpp
// head存储链表头，e[]存储节点的值，ne[]存储节点的next指针，idx表示当前用到了哪个节点
int head, e[N], ne[N], idx;

// 初始化
void init()
{
    head = -1;
    idx = 0;
}

// 在链表头插入一个数a
void insert(int a)
{
    e[idx] = a, ne[idx] = head, head = idx ++ ;
}

// 将头结点删除，需要保证头结点存在
void remove()
{
    head = ne[head];
}

```

#### 双向链表

```cpp
// e[]表示节点的值，l[]表示节点的左指针，r[]表示节点的右指针，idx表示当前用到了哪个节点
int e[N], l[N], r[N], idx;

// 初始化
void init()
{
    //0是左端点，1是右端点
    r[0] = 1, l[1] = 0;
    idx = 2;
}

// 在节点a的右边插入一个数x
void r_insert(int a, int x)
{
    e[idx] = x;
    l[idx] = a, r[idx] = r[a];
    l[r[a]] = idx, r[a] = idx ++ ;
}

// 在节点a的左边插入一个数x
void l_insert(int a, int x)
{
    e[idx] = x;
    r[idx] = a, l[idx] = l[a];
    r[r[a]] = idx, l[a] = idx ++ ;
}

// 删除节点a
void remove(int a)
{
    l[r[a]] = l[a];
    r[l[a]] = r[a];
}


```

# 字符串哈希

核心思想：将字符串看成P进制数，P的经验值是131或13331，取这两个值的冲突概率低
小技巧：取模的数用2^64，这样直接用unsigned long long存储，溢出的结果就是取模的结果

```cpp
ULL h[N], p[N]; // h[k]存储字符串前k个字母的哈希值, p[k]存储 P^k mod 2^64

// 初始化
p[0] = 1;
for (int i = 1; i <= n; i ++ )
{
    h[i] = h[i - 1] * P + str[i];
    p[i] = p[i - 1] * P;
}

// 计算子串 str[l ~ r] 的哈希值
ULL get(int l, int r)
{
    return h[r] - h[l - 1] * p[r - l + 1];
}
```

# 欧拉函数

筛法求欧拉函数

```cpp
int primes[N], cnt;     // primes[]存储所有素数
int euler[N];           // 存储每个数的欧拉函数
bool st[N];         // st[x]存储x是否被筛掉

void get_eulers(int n)
{
    euler[1] = 1;
    for (int i = 2; i <= n; i ++ )
    {
        if (!st[i])
        {
            primes[cnt ++ ] = i;
            euler[i] = i - 1;
        }
        for (int j = 0; primes[j] <= n / i; j ++ )
        {
            int t = primes[j] * i;
            st[t] = true;
            if (i % primes[j] == 0)
            {
                euler[t] = euler[i] * primes[j];
                break;
            }
            euler[t] = euler[i] * (primes[j] - 1);
        }
    }
}


```

朴素求单个欧拉函数

```cpp
int phi(int x)
{
    int res = x;
    for (int i = 2; i <= x / i; i ++ )
        if (x % i == 0)
        {
            res = res / i * (i - 1);
            while (x % i == 0) x /= i;
        }
    if (x > 1) res = res / x * (x - 1);

    return res;
}
```



# 质数筛

线性筛

```cpp
int primes[N], cnt;     // primes[]存储所有素数
bool st[N];         // st[x]存储x是否被筛掉

void get_primes(int n)
{
    for (int i = 2; i <= n; i ++ )
    {
        if (!st[i]) primes[cnt ++ ] = i;
        for (int j = 0; primes[j] <= n / i; j ++ )
        {
            st[primes[j] * i] = true;
            if (i % primes[j] == 0) break;
        }
    }
}


```



# 分解质因数

```cpp
void divide(int x)//直接处理
{
    for (int i = 2; i <= x / i; i ++ )
        if (x % i == 0)
        {
            int s = 0;
            while (x % i == 0) x /= i, s ++ ;
            cout << i << ' ' << s << endl;
        }
    if (x > 1) cout << x << ' ' << 1 << endl;
    cout << endl;
}

------------------------------------------------------------ 
//先筛出质数减少循环
int primes[N], cnt;     // primes[]存储所有素数
bool st[N];         // st[x]存储x是否被筛掉

void get_primes(int n)
{
    for (int i = 2; i <= n; i ++ )
    {
        if (!st[i]) primes[cnt ++ ] = i;
        for (int j = 0; primes[j] <= n / i; j ++ )
        {
            st[primes[j] * i] = true;
            if (i % primes[j] == 0) break;
        }
    }
}

void divide(int x)//输出格式 质因数 个数
{
    int cnt = 0;//质因子种类数  8只有1个
    for (int i = 0; primes[i] <= x / primes[i]; i ++ )
        if (x % primes[i] == 0)
        {
            cnt++;
            int s = 0;
            while (x % primes[i] == 0) x /= primes[i], s ++ ;
            cout << primes[i] << ' ' << s << endl;
        }
    if (x > 1) {
        cout << x << ' ' << 1 << endl;
        cnt++;
    }
    cout << endl;
}
```



# 组合数

#### 递归法	范围2000

```cpp
// c[a][b] 表示从a个苹果中选b个的方案数
for (int i = 0; i < N; i ++ )
    for (int j = 0; j <= i; j ++ )
        if (!j) c[i][j] = 1;
        else c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) % mod;
```

#### 通过预处理逆元的方式求组合数		范围1e5

```cpp
首先预处理出所有阶乘取模的余数fact[N]，以及所有阶乘取模的逆元infact[N]
如果取模的数是质数，可以用费马小定理求逆元
int qmi(int a, int k, int p)    // 快速幂模板
{
    int res = 1;
    while (k)
    {
        if (k & 1) res = (ll)res * a % p;
        a = (ll)a * a % p;
        k >>= 1;
    }
    return res;
}

// 预处理阶乘的余数和阶乘逆元的余数
fact[0] = infact[0] = 1;
for (int i = 1; i < N; i ++ )
{
    fact[i] = (ll)fact[i - 1] * i % mod;
    infact[i] = (ll)infact[i - 1] * qmi(i, mod - 2, mod) % mod;
}

int C(n,m){
	return fact[n]*infact[m]%mod*infact[n-m]%mod;
}
```

![](https://cdn.acwing.com/media/article/image/2020/07/16/35805_f4228ae4c7-%E7%BB%84%E5%90%88%E6%95%B0.png)

#### Lucas定理		范围1e18  ，模数p范围1e5

若p是质数，则对于任意整数 1 <= m <= n，有：

 C(n, m) = C(n % p, m % p) * C(n / p, m / p) (mod p)

```cpp
int qmi(int a, int k, int p)  // 快速幂模板
{
    int res = 1 % p;
    while (k)
    {
        if (k & 1) res = (ll)res * a % p;
        a = (ll)a * a % p;
        k >>= 1;
    }
    return res;
}

int C(int a, int b, int p)  // 通过定理求组合数C(a, b)
//可以替换成上面预处理阶乘求组合数变成O(1)
{
    if (a < b) return 0;

    LL x = 1, y = 1;  // x是分子，y是分母
    for (int i = a, j = 1; j <= b; i --, j ++ )
    {
        x = (ll)x * i % p;
        y = (ll) y * j % p;
    }

    return x * (LL)qmi(y, p - 2, p) % p;
}

int lucas(ll a, ll b, int p)
{
    if (a < p && b < p) return C(a, b, p);
    return (ll)C(a % p, b % p, p) * lucas(a / p, b / p, p) % p;
}

```

#### 质因数分解求组合数	真实值

当我们需要求出组合数的真实值，而非对某个数的余数时，分解质因数的方式比较好用：

1. 筛法求出范围内的所有质数
2. 通过 C(a, b) = a! / b! / (a - b)! 这个公式求出每个质因子的次数。 n! 中p的次数是 n / p + n / p^2 + n / p^3 + ...
3. 用高精度乘法将所有质因子相乘

```cpp
int primes[N], cnt;     // 存储所有质数
int sum[N];     // 存储每个质数的次数
bool st[N];     // 存储每个数是否已被筛掉


void get_primes(int n)      // 线性筛法求素数
{
    for (int i = 2; i <= n; i ++ )
    {
        if (!st[i]) primes[cnt ++ ] = i;
        for (int j = 0; primes[j] <= n / i; j ++ )
        {
            st[primes[j] * i] = true;
            if (i % primes[j] == 0) break;
        }
    }
}


int get(int n, int p)       // 求n！中的次数
{
    int res = 0;
    while (n)
    {
        res += n / p;
        n /= p;
    }
    return res;
}


vector<int> mul(vector<int> a, int b)       // 高精度乘低精度模板
{
    vector<int> c;
    int t = 0;
    for (int i = 0; i < a.size(); i ++ )
    {
        t += a[i] * b;
        c.push_back(t % 10);
        t /= 10;
    }

    while (t)
    {
        c.push_back(t % 10);
        t /= 10;
    }

    return c;
}

get_primes(a);  // 预处理范围内的所有质数

for (int i = 0; i < cnt; i ++ )     // 求每个质因数的次数
{
    int p = primes[i];
    sum[i] = get(a, p) - get(b, p) - get(a - b, p);
}

vector<int> res;
res.push_back(1);

for (int i = 0; i < cnt; i ++ )     // 用高精度乘法将所有质因子相乘
    for (int j = 0; j < sum[i]; j ++ )
        res = mul(res, primes[i]);

```



# Splay

**主要作用：**维护区间特定的顺序（中序遍历顺序不变）

**文艺伸展树**

区间翻转问题：这里编号可能会改变，但是维护的是另一个隐藏的顺序——此时区间从左往右的顺序。

```cpp
struct Node{
	int s[2];//s[0]左儿子,s[1]右儿子
  int p, v;//p父亲节点编号，v节点编号
	int size;//当前节点为根的子树大小
  int flag;//当前节点为根的子树是否反转

	void init(int _v, int _p){//新节点初始化
		v = _v, p = _p;
		size = 1;
	}
}tr[N];
int root, idx;//根节点编号，节点个数（相当于内存池的指针）

void pushup(int x)//由子树更新当前节点信息（维护的信息一般是所有子节点的信息（最值，个数））
{
	tr[x].size = tr[tr[x].s[0]].size + tr[tr[x].s[1]].size + 1;
}

void pushdown(int x){//更新子节点信息，一般在修改时用到，查询也用到（要传到叶子节点才能得到真实值）
	if(tr[x].flag)
	{
		swap(tr[x].s[0], tr[x].s[1]);//反转操作
    //下传
		tr[tr[x].s[0]].flag ^= 1;
		tr[tr[x].s[1]].flag ^= 1;
		tr[x].flag = 0;//清除标记
	}
}

void rotate(int x){//左旋右旋（合并了）
	int y = tr[x].p, z = tr[y].p;
	int k = tr[y].s[1] == x;//x是y的s[k]
  /*
  口诀：（对于x）
  反儿子代替自己变成父亲正儿子
  父亲变成自己的反儿子
  代替父亲成为爷爷的（与原来相同）儿子
  */
  //更新父子关系
	tr[y].s[k] = tr[x].s[k^1];
	tr[tr[x].s[k^1]].p = y;
  
	tr[x].s[k^1] = y;
	tr[y].p = x;
  
	tr[z].s[y==tr[z].s[1]] = x;
	tr[x].p = z;
	pushup(x),pushup(y);//父子关系改变，更新信息
}

void splay(int x,int k){//把x不断左旋或右旋到k，并保持平衡
  //一般设置0，n+1为左右哨兵
	while(tr[x].p != k){//没有到达
		int y = tr[x].p, z = tr[y].p;
		if(z!=k){//爷爷如果就是k，只需要单旋
			if((tr[y].s[1]==x) ^ (tr[z].s[1]==y)) rotate(x);//直线型
			else rotate(y);//之字型
		}
		rotate(x);
	}
	if(!k) root = x;//k==0说明此时x是根，更新root
}

void insert(int v){//biuld要递归，可以一个一个插入建立
	int u = root, p = 0;//从根节点开始往下查找
	while(u) p = u, u = tr[u].s[v>tr[u].v];//v大在右子树
	u = ++idx;//新建节点的编号
	if(p) tr[p].s[v>tr[p].v] = u;//如果p不是哨兵，说明u不是根那它父亲节点是p
	tr[u].init(v,p);//初始化
	splay(u,0);//把u伸展到根，保证平衡
}

int get_k(int k){//找到中序遍历第k个点
	int u = root;
	while(1){
		pushdown(u);//标记下传
    //由子树大小递归左儿子或右儿子
		if(tr[tr[u].s[0]].size>=k) u = tr[u].s[0];
		else if(tr[tr[u].s[0]].size+1==k) return u;
		else k-=tr[tr[u].s[0]].size+1,u = tr[u].s[1];
	}
	return -1;
}

void output(int u){//中序遍历
	pushdown(u);
	if(tr[u].s[0]) output(tr[u].s[0]);
	if(tr[u].v>=1&&tr[u].v<=n) wtb(tr[u].v);//排除哨兵
	if(tr[u].s[1]) output(tr[u].s[1]);
}

```



# 三分

### 1. 普通三分

把区间三等分，需要两个点m1，m2，看哪个函数值更接近极值点，保留它更靠近的端点，另一个端点变成m1，m2其中的一个，如图



![1](https://pic2.zhimg.com/80/v2-4a6039459e5d9afc346ab74a3dab9e21_1440w.jpg)

m2比m1更靠近极值点，所以r不变，l = m1

**不能处理存在函数值相等的单峰函数，必须严格单调**

多峰函数求极值用模拟退火

```cpp
double l = 0,r = 10000;
while(r-l>=0.01){//精度问题
    double m1 = l + (r-l)/3.0,m2 = r - (r-l)/3.0;
    if(f(m1)<f(m2))//极大值
        l = m1;
    else
        r = m2;
}
```

### 2.三分套三分

三分套三分与三分类似，每个三分对应的都是一个变量，在三分第一个变量的时候，再三分第二个变量，与二分套二分类似。当然，每个变量与答案之间的关系是一个单峰函数，如果是单调的换成二分即可。

```cpp
int find(int m){
    while(r-l>=0.01){//三分y
        double m1 = l + (r-l)/3.0,m2 = r - (r-l)/3.0;
        if(f(m1)<f(m2))//极大值
            l = m1;
        else
            r = m2;
    }
    return l;
}
while(r-l>=0.01){//三分x
    double m1 = l + (r-l)/3.0,m2 = r - (r-l)/3.0;
    if(find(m1)<find(m2))
        l = m1;
    else
        r = m2;
}
```



# 计算几何

#### 1.常用基础函数

##### 	符号函数

```cpp
int sgn(double x) {
	if (fabs(x) < eps) {
		return 0;
	}
	return (x<0) ? -1 : 1;
}
```

##### 角度弧度转化

```cpp
double R_to_D(double x) { //弧度转角度
	return x * 180 / PI;
}

double D_to_R(double x) { //角度转弧度
    return x / 180 * PI;
}
```

##### 弧长计算

```cpp
double Arc_len(double x, double R) { //弧度算弧长
	return x * R; //R是半径
}

double Arc_len(double x, double R) { //角度算弧长
	return x / 180 * PI * R;
}
```

#### 2.常用的类

##### 点类

```cpp
struct Point{
    double x,y;
    Point(){}
    Point(double _x,double _y){x = _x,y = _y;}
    void input(){scanf("%lf%lf",&x,&y);}
    void output(){printf("%.2f %.2f\n",x,y);}
    bool operator == (Point b)const{return sgn(x-b.x) == 0 && sgn(y-b.y) == 0;}
    bool operator < (Point b)const{return sgn(x-b.x) == 0 ? sgn(y-b.y)<0 : x<b.x;}//和PII的默认一样
    Point operator -(const Point &b)const{return Point(x-b.x,y-b.y);}
    Point operator + (const Point &b)const{return Point(x+b.x,y+b.y);}
    Point operator * (const double &k)const{return Point(x*k,y*k);} 
    Point operator / (const double &k)const{return Point(x/k,y/k);} 
    /**
     * 叉积
     */
    double operator ^ (const Point &b)const{return x*b.y-y*b.x;}    
    /**
     * 点积
     */
    double operator * (const Point &b)const{return x*b.x+y*b.y;}    
    /**
     * 返回到原点的长度
     */
    double len(){return hypot(x,y);}                                
    /**
     * 返回长度平方
     */
    double len2(){return x*x+y*y;}                                  
    /**
     * 返回两点间距离
     */
    double distance(Point p){return hypot(x-p.x,y-p.y);}
    /**
     * 计算该点看a,b点的角度
     */
    double rad(Point a,Point b){Point p = *this;return fabs(atan2(fabs((a-p)^(b-p)),(a-p)*(b-p)));}
    /**
     * 化为长度为r的向量
     */
    Point trunc(double r){  
        double l = len();
        if(!sgn(l)) return *this; //原来长度为0
        r /= l;
        return Point(x*r,y*r);    
    }
    /**
     * 逆时针转90度
     */
    Point rotleft(){return Point(-y,x);}                             
    /**
     * 顺时针转90度
     */
    Point rotright(){return Point(y,-x);}                            
    /**
     * 绕p点逆时针转angle
     */
    Point rotate(Point p,double angle){                              
        Point v = (*this)-p;
        double c = cos(angle),s = sin(angle);
        return Point(p.x+v.x*c-v.y*s,p.y+v.x*s+v.y*c);
    }
};

```

##### 线类

```cpp
struct Line{
    Point s,e;
    Line(){}
    Line(Point _s,Point _e){s = _s;e = _e;}
    bool operator == (Line v){return (s == v.s) && (e == v.e);}
    /**
     * 根据一个点和倾斜角angle确定直线，0<=angle<=pi
     */
    Line(Point p,double angle){                                     
        s = p;
        if(sgn(angle-pi/2) == 0){e = (s+Point(0,1));}//特判垂直x轴
        else{e = (s+Point(1,tan(angle)));}
    }
    /**
     * ax+by+c=0
     */
    Line(double a,double b,double c){                               
        if(sgn(a) == 0){s = Point(0,-c/b);e=Point(1,-c/b);}//特判垂直x轴
        else if(sgn(b) == 0){s = Point(-c/a,0);e = Point(-c/a,1);}//特判垂直y轴
        else{s = Point(0,-c/b);e = Point(1,(-c-a)/b);}
    }
    void input(){s.input();e.input();}//调用了点类的input                             
    void adjust(){if(e < s) swap(s,e);}//起点总是在左下方
    /**
     * 求线段长度
     */
    double length(){return s.distance(e);}                          
    /**
     * 返回直线倾斜角0<=angle<=pi
     */
    double angle(){                                                 
        double k = atan2(e.y-s.y,e.x-s.x);
        if(sgn(k)<0) k+=pi;
        if(sgn(k-pi)==0) k-= pi;
        return k;
    }
    /**
     * 点和直线的关系
     * 1在左侧
     * 2在右侧
     * 3在直线上
     */
    int pointonseg(Point p){                                          
        int c = sgn((p-s)^(e-s));
        if(c < 0)return 1;
        else if(c > 0) return 2;
        else return 3;
    }
    /**
     * 点在线段上的判断
     */
    bool  pointonseg(Point p){return sgn((p-s)^(e-s)) == 0 && sgn((p-s)*(e-s)) <= 0;}   
    /**	
     * 两向量平行（对应直线平行或重合）
     */
    bool parallel(Line v){return sgn((e-s)^(v.e-v.s)) == 0;}        
    /**
     * 两线段相交判断
     * 2规范相交
     * 1非规范相交  
     * 0不相交
     * 相交有很多种，这里指的“相交”是指两条线段恰好有唯一一个不是端点的公共点，我们称为“规范相交”。即如果一条线段的一个端点恰在另一线段上，则不视为相交；如果两条线段部分重合，也不视为相交，（这些情况我们称为“非规范相交”）
     */
    int segcrosseg(Line v){                                         
        int d1 = sgn((e-s)^(v.s-s));
        int d2 = sgn((e-s)^(v.e-s));
        int d3 = sgn((v.e-v.s)^(s-v.s));
        int d4 = sgn((v.e-v.s)^(e-v.s));
        if((d1^d2) == -2 && (d3^d4) == -2)return 2;
        return (d1 == 0 && sgn((v.s-s)*(v.s-e)) <= 0) || 
               (d2 == 0 && sgn((v.e-s)*(v.e-e)) <= 0) ||
               (d3 == 0 && sgn((s-v.s)*(s-v.e)) <= 0) ||
               (d4 == 0 && sgn((e-v.s)*(e-v.e)) <= 0);
    }
    /**
     * 直线和线段相交判断
     * 2规范相交
     * 1非规范相交
     * 0不相交
     */
    int linecrossseg(Line v){                                       
        int d1 = sgn((e-s)^(v.s-s));
        int d2 = sgn((e-s)^(v.e-s));
        if((d1^d2) == -2) return 2;
        return (d1 == 0 || d2 == 0);
    }
    /**
     * 两直线关系
     * 0平行
     * 1重合
     * 2相交
     */
    int linecrossline(Line v){                                      
        if((*this).parallel(v)) return v.pointonseg(s) == 3;
        return 2;
    }
    /**
     * 求两直线焦点，要保证两直线不平行或重合
     */
    Point crosspoint(Line v){                                       
        double a1 = (v.e-v.s)^(s-v.s);
        double a2 = (v.e-v.s)^(e-v.s);
        return Point((s.x*a2-e.x*a1)/(a2-a1),(s.y*a2-e.y*a1)/(a2-a1));
    }
    /**
     * 点到直线的距离
     */
    double dispointtoline(Point p){return fabs((p-s)^(e-s))/length();}  
    /**
     * 点到线段的距离
     */
    double dispointtoseg(Point p){                                  
        if(sgn((p-s)*(e-s)) < 0 || sgn((p-e)*(s-e)) < 0)
            return min(p.distance(s),p.distance(e));
        return dispointtoline(p);
    }
    /**
     * 线段到线段的距离，前提是两线段不相交，相交距离为0
     */
    double dissegtoseg(Line v){                                     
        return min(min(dispointtoseg(v.s),dispointtoseg(v.e)),min(v.dispointtoseg(s),v.dispointtoseg(e)));
    }
    /**
     * 返回点p在直线上的投影
     */
    Point lineprog(Point p){return s+(((e-s)*((e-s)*(p-s)))/((e-s).len2()));}   
    /**
     * 返回点p关于直线的对称点
     */
    Point symmetypoint(Point p){Point q = lineprog(p);return Point(2*q.x-p.x,2*q.y-p.y);}   
};

```

#### 圆类

```cpp
struct  circle
{
    Point p;
    double r;
    circle(){}
    circle(Point _p,double _r){p = _p;r = _r;}
    circle(double x,double y,double _r){p = Point(x,y);r = _r;}
    /**
     * 三角形外接圆，需要Point的+/rotate()以及line的crosspoint()。利用两边中垂线得圆心
     */
    circle(Point a,Point b,Point c){                                 
        Line u = Line((a+b)/2,((a+b)/2)+((b-a).rotleft()));
        Line v = Line((b+c)/2,((b+c)/2)+((c-b).rotleft()));
        p = u.crosspoint(v);
        r = p.distance(a);
    }
    /**
     * 三角形内切圆,参数bool t无作用，只是与外接圆区别  
     */
    circle(Point a,Point b,Point c,bool t){                          
        Line u,v;
        double m = atan2(b.y-a.y,b.x-a.x),n = atan2(c.y-a.y,c.x-a.x);
        u.s = a,v.s = b;
        u.e = u.s+Point(cos((n+m)/2),sin((n+m)/2));
        m = atan2(a.y-b.y,a.x-b.x),n = atan2(c.y-b.y,c.x-b.x);
        v.e = v.s+Point(cos((n+m)/2),sin((n+m)/2));
        p = u.crosspoint(v);
        r = Line(a,b).dispointtoseg(p);
    }
    void input(){p.input();scanf("%lf",&r);}
    void output(){printf("%.2lf %.2lf %.2lf\n",p.x,p.y,r);}
    bool operator == (circle v)const{return (p==v.p) && sgn(r-v.r) == 0;}
    bool operator < (circle v)const{return ((p<v.p) || ((p==v.p) && sgn(r-v.r) < 0));}
    /**
     * 返回面积
     */
    double area(){return pi*r*r;}                                

    /**
     * 返回周长
     */
    double circumference(){return 2*pi*r;}                      

    /**
     * 点和圆的关系，0圆外，1圆上，2圆内
     */
    int relation(Point b){                                           

        double dst = b.distance(p);
        if(sgn(dst-r) < 0)return 2;
        else if(sgn(dst-r) == 0)return 1;
        else return 0;
    }
    /**
     * 线段和圆的关系，比较的是圆心到线段的距离和半径的关系
     */
    int relationseg(Line v){                                          

        double dst = v.dispointtoseg(p);
        if(sgn(dst-r) < 0)return 2;
        else if(sgn(dst-r) == 0)return 1;
        else return 0;
    }
    /**
     * 直线和圆的关系，比较的是圆心到线段的距离和半径的关系
     */
    int relationline(Line v){                                         

        double dst = v.dispointtoline(p);
        if(sgn(dst-r) < 0)return 2;
        else if(sgn(dst-r) == 0)return 1;
        else return 0;
    }
    /**
     * 两圆关系
     * 5相离
     * 4外切
     * 3相交
     * 2内切
     * 1内含
     */
    int relationcircle(circle v){                                   

        double d = p.distance(v.p);
        if(sgn(d-r-v.r) > 0)return 5;
        if(sgn(d-r-v.r) == 0)return 4;
        double l = fabs(r-v.r);
        if(sgn(d-r-v.r)<0 && sgn(d-l)>0)return 3;
        if(sgn(d-l) == 0)return 2;
        if(sgn(d-l) < 0)return 1;
    }
    /**
    *求两圆交点
    *0是无交点
    *1是一个交点
    *2是两个
     */
    int pointcrosscircle(circle v,Point &p1,Point &p2){              
        int rel = relationcircle(v);
        if(rel == 1 || rel == 5)return 0;
        double d = p.distance(v.p);
        double l = (d*d+r*r-v.r*v.r)/(2*d);
        double h = sqrt(r*r-l*l);
        Point tmp = p + (v.p-p).trunc(l);
        p1 = tmp + ((v.p-p).rotleft().trunc(h));
        p2 = tmp + ((v.p-p).rotright().trunc(h));
        if(rel == 2 || rel == 4)
            return 1;
        return 2;
    }
};

```





# FFT

