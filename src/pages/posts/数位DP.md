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
pubDate: 2021-11-17 19:02:31
tags:
- ACM
- ICPC
- 题解
theme: light
title: 数位DP
---

# 数位DP

### 【介绍】

显然，是一种DP。

再显然，是一种关于每一位数字之间关系（性质）的DP

---

### 【题目特征】



**题目描述**一般是求【L，R】范围内满足各位数字间存在某种规律的数有几个



数位DP的题目**数据范围**往往很大，动不动就是1e18，但是由于是数位DP只跟位数有关，所以也就18位。

---

### 【算法设计】

使用**记忆化搜索**进行DP因为会出现重复出现的状态，使用记忆化搜索可以减少重复的搜索，减少复杂度。

#### 一.记忆化搜索的过程

​		从起点向下搜索，搜索的途中累加每一位的答案，最后在起点得到答案。

#### 二. 区间转化为[0,X]

​	对于[L,R]的区间问题，一般我们可以根据前缀和相减转化为[0,R] - [0,L-1]的问题。

#### 三.dfs的参数

**pos**, 当前找到了第几位
**limit**，因为问题已经转化为了小于X的所有正整数中符合条件的个数，我们从高位枚举，一旦当前位小于X，那么后面数字可以随便选。limit就是判断当前位是否可以任意选。

> **递归中limit的传递**
>
> 1.当前没有限制limit=0，那么显然后面应该都没限制，是0
>
> 2.当前有限制limit=1；
>
> ​	1.如果当前位选的数小于X对应位数字，那么后面应该是没限制0
>
> ​	2.如果当前位选的数恰好等于X对应位数字，这个分支相当于是紧贴着X的每一位（前面枚举到的位选的和X一样），那么后面还要限制数字大小，limit为1
>
> 
>
> **综上：我们可以总结出limit的转移方程  limit = limit&&j==X[i]** (X[i]是当前位能枚举得最大值, j是当前正在枚举得数)

  3.**pre，**有些题目的性质是和前几位数字有关，那么也可以加上pre1...pre2

  4.**zero，**判断是否有前导0，比如所有位相同的数包括000333（实质是333）前面都是0的话取1，否则取0

> **递归中zero前导零的传递**
>
> 1.前一位是前导0
>
> ​	1.当前位是0，那么后面还是zero还是1
>
> ​	2.当前位不是0，那么后面zero=0
>
> 2.前一位不是前导0，那么不管当前位是不是0，后面zero都是1
>
> 
>
> **综上：我们可以总结出zero的转移方程  zero = zero&&(!j)** (X[i]是当前位能枚举得最大值, j是当前正在枚举得数)







#### 四.记忆化搜索的记忆化

​	我们可以用一个dp数组来记录已经确认的状态的值，下标用来表示状态，等到后面搜到相同状态时不用递归到最底层直接可以拿来复用。

#### 五.模板

```cpp
ll dfs(int pos,int pre,int st,……,int lead,int limit)//记忆化搜索
{
    if(pos>len) return st;//剪枝
    if((dp[pos][pre][st]……[……]!=-1&&(!limit)&&(!lead))) return dp[pos][pre][st]……[……];//相同状态，也可以吧limit和lead也放入dp数组中（多开两个维度）
    ll ret=0;//暂时记录当前方案数
    int res=limit?a[len-pos+1]:9;//res当前位能取到的最大值，limit的作用
    for(int i=0;i<=res;i++)//搜索每个可取的数
    {
        //有前导0并且当前位也是前导0
        if((!i)&&lead) ret+=dfs(……,……,……,i==res&&limit);
        //有前导0但当前位不是前导0，当前位就是最高位
        else if(i&&lead) ret+=dfs(……,……,……,i==res&&limit); 
        else if(根据题意而定的判断) ret+=dfs(……,……,……,i==res&&limit);
    }
    if(!limit&&!lead) dp[pos][pre][st]……[……]=ret;//没前导零，后面无限制，当前状态方案数记录
    return ret;
}
ll part(ll x)//把数按位拆分
{
    len=0;
    while(x) a[++len]=x%10,x/=10;
    memset(dp,-1,sizeof dp);//初始化-1（因为有可能某些情况下的方案数是0）
    return dfs(……,……,……,……);//进入记搜
}
int main()
{
    scanf("%d",&T);
    while(T--)
    {
        scanf("%lld%lld",&l,&r);
        if(l) printf("%lld",part(r)-part(l-1));//[l,r](l!=0)
        else printf("%lld",part(r)-part(l));//从0开始要特判
    }
    return 0;
}
```

​	

### 【例题】

- #### [45届icpc上海Sum of Log](https://ac.nowcoder.com/acm/contest/21785/C)

一般的数位DP套路题都是一个数满足什么性质，而这题是两个数满足一个性质就是与起来是0。那么我们类比一下，原来限制单个数后面取值的limit现在要有两个，而当前搜索的位置因为两个数位置总是同步的，所以只需要一个。因为两个数&起来等于0，那么他们相加是不进位的，又取了log，答案就是最高位的位置加1，所以每一位的贡献就是这位是最高位的数量乘以这位的位置+1.

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
int num1[33],num2[33],dp[33][2][2];
int st[maxn];
int bit[33];
int L, R, ans;

int dfs(int now, int limit1, int limit2, int zero){
	if(now == -1) return 1;//枚举完了
	int &x = dp[now][limit1][limit2];
	if(~x) return x;//已经搜过了
	if ((!limit1)&&(!limit2)&&!zero) return x = bit[now+1];//没有限制，后面就是全部的组合
	int end1 = limit1?num1[now]:1;
	int end2 = limit2?num2[now]:1;
	x = 0;
	int temp = 0, cnt = 0;
	rep(i,0,end1){
		rep(j,0,end2){
			if(i&j) continue;//不符合&=0
			if(zero&&(i|j)){
				temp = dfs(now-1,limit1&&(i==end1),limit2&&(j==end2),0);
				x = (x+temp)%mod;//为上一层累加
				cnt = (cnt+temp)%mod;//当前位是最高位
			}
			else{
				x = (x+dfs(now-1,limit1&&(i==end1),limit2&&(j==end2),zero&&(!(i|j))))%mod;//为上一层累加
			}
		}
	}
	ans=(ans+cnt*(now+1))%mod;
	return x;
}
void part(int X, int Y){
	int len = -1;//数字放在【0，len】中
	while(X || Y) {
		num1[++len] = X%2, X/=2;
		num2[len] = Y%2, Y/=2;
	}
	ans = 0;
	mem(dp,-1);
	dfs(len,1,1,1);
	wtl(ans);
}
void solve(){
	cin >> L >> R;
	part(L,R);

}
signed main()
{

	bit[0] = 1;
	rep(i,1,32) bit[i] = bit[i-1]*3%mod;
	cin >> T;
	while(T--) solve();
  return (0-0); //<3
} 
```

---

- #### [2020Hong Kong   J. Junior Mathematician](https://codeforces.com/gym/102452/problem/J)

这题与上题不同，只有一个数，我们可以用前缀和相减来求，但是数字太大有5000位，需要用到字符串来存储，对字符串求减一涉及到借位，可能有些麻烦（其实也并不麻烦）。这里提供另一种思路，就是判断L这个数是否满足即可。

**参数分析：**

1. 满足f（x）= x（mod M） 我们可以构造g（x）= f（x）- x，那么条件变成g（x）= 0 （mod M）
2. 计算f（x）时，为了避免重复计算贡献，规定当前数字只会跟前面的数字产生贡献，那么我们只需要记录每一位数字的前缀和pre，然后当前数字的贡献就是j * pre



```cpp
#include<bits/stdc++.h>
using namespace std;


#define mem(a,b) memset(a,b,sizeof a)
#define PII pair<int,int>
#define ull unsigned long long
#define fi first
#define se second
#define endl '\n'
#define PI acos(-1.0)
#define lcm(a,b) a/gcd(a,b)*b
#define INF 0x3f3f3f3f3f3f3f3f
#define debug(a) cerr<<#a<<"="<<a<<endl;
#define Adebug(a,i) cerr<<#a<<"["<<i<<"]="<<a[i]<<endl;
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


inline void wt(int x){cout << x;}
inline void wtl(int x){cout << x << endl;}
inline void wtb(int x){cout << x << ' ';}
template <typename T> bool ckmax(T &x, T y){return x < y ? x = y, true : false;}
template <typename T> bool ckmin(T &x, T y){return x > y ? x = y, true : false;}
int qpow(int a,int b){int res = 1;while(b){if(b&1) res *= a;b>>=1;a*=a;}return res;}
int mo(int x,int p){return x = ((x%p)+p)%p;}
int gcd(int a,int b){return b?gcd(b,a%b):a;}
const int maxn = 1e6+7;
const int mod = 1e9+7;

int T,N,M,K;
int bit[5009],A[5009],dp[5009][61][61][2],id,st[5009][61][61][2];
char R[5009],L[5009];
int f;
int dfs(int now,int pre,int fx, int limit){
	long long ans = 0;
	if(now==(N+1)){
		f = (fx==0);//判断X是否可行
		return f;
	}
	if (st[now][pre][fx][limit]==id) return dp[now][pre][fx][limit];//这样可以不用初始化dp数组，等于当前id说明是本组数据，不同组的模数是不同的，所以同一个状态的值可能不同
	st[now][pre][fx][limit] = id;
	int lim = limit?A[now]:9;
	rep(i,0,lim){
		int dif = mo((fx+i*pre-i*bit[N-now]),M);
		ans = ans+dfs(now+1,(pre+i)%M,dif,limit&&(i==A[now]));
	}
	ans = (ans+mod)%mod;
	dp[now][pre][fx][limit] = ans;
	return ans;
}
int part(char X[]){
	//printf("!---%s\n",X+1);
	++id;//标记测试数据组别
	N = strlen(X+1);	
	rep(i,1,N) A[i] = X[i]-'0';
	return dfs(1,0,0,1);	
}
void solve(){
	scanf("%s %s %d",L+1,R+1,&M);
	N = strlen(R+1);
    bit[0] = 1;
	rep(i,1,N){
		bit[i] = bit[i-1]*10%M;
	}
	int ans = part(R);
	f = 0;
	ans-=part(L);
	//debug(f);
	ans+=f;//f是判断L是否有效，有效的话就为1（前缀和相减时多减了1加回来）
	wtl(mo(ans,mod));

}
signed main()
{
	cin >> T;
	while(T--) solve();
    return (0-0); //<3
} 
```

