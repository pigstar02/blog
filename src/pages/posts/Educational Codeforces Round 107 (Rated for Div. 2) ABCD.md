---
author: pigstar
cover:
  alt: cover
  square: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
  url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU
keywords: key1, key2, key3
layout: ../../layouts/MarkdownPost.astro
meta:
  author: pigstar
  keywords: key3, key4
pubDate: 2021-04-14 16:06:05
theme: light
title: Educational Codeforces Round 107 (Rated for Div. 2) ABCD
---



## A. Review Site

**题意**给你n个数，是n个人的评价，1是好评，2是差评，3是哪个多选哪个。但是你有两个服务器，你可以控制用户进入指定服务器。求最多可以得到多少个好评。

**思路**只要让所有好评到第一个服务器，所有差评到第二个服务器，评价为3的人都到第一个服务器。答案就是1和3的数量。

**代码**

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e5;

void solve(){
	int n,ans=0,x;
	cin >> n;
	for(int i = 1; i <= n; i ++) {
		cin >> x;
		if(x==1||x==3) ans++;
	}
	printf("%d\n",ans);
}
int main(){
	int T;
	cin >> T;
	while (T--){
		solve();
	}
	return 0;
}
```
---
## B. GCD Length
**题意**一个构造题，给你三个数a，b，c要求构造出长度为a的x和长度为b的y，x和y的最大公约数长度为c。

**思路**c肯定<=min(a,b) ，我们让x，y的末尾c-1位全是0，前面剩余位数是对应位数的质数。
- 注意0的个数和位数是差1的。（混了=wa了）

**代码**

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e5;
int p[10];
bool isprime(int x)
{
    if (x < 2) return false;
    for (int i = 2; i <= x / i; i ++ )
        if (x % i == 0)
            return false;
    return true;
}
void init (){//预处理各个长度的质数
 //因为pow返回的是浮点数，x[i]是10的i次方
 long long x[11];
 x[0] = 1;
 for(int i = 1; i <= 10; i ++){
 	x[i] = x[i-1]*10;
 }
 
 //找质数
  p[0]=1;
 for(int i = 1; i <= 9; i ++){
  for(int j = x[i]-1; j >= x[i-1];j-=2){
   if(isprime(j)){
    p[i] = j;
    break;
   }
  }
 }
}
int main(){
 int T;
 cin >> T;
 int a, b ,c;
 init();//预处理
 while (T--){
  cin >> a >> b >> c;
  int x=1;
  a-=c-1;//公约数c位，但只有c-1个0
  b-=c-1;
  c--;
  while(c--){
   x*=10;
  }
  int ans1,ans2;
  ans1 = p[a];
  ans2 = p[b];
  if(ans1==ans2) ans1++;//一样的话加1，a和a+1互质
  printf("%d %d\n",ans1*x,ans2*x);
 }
 return 0;
}
```
---
## C. Yet Another Card Deck
**题意**有n个数，分别是n张牌的颜色，每次询问一种颜色最前面出现的位置并输出，输出后将它移到最前面。

**思路**因为每个牌询问后会放到最前面，下次再次询问该颜色时，它一定是最前面的。所以对于同一种颜色我们只要保存最前面一个的颜色和位置。颜色数量最多为50个，那么牌的数量可以缩减到50，接下来只需要暴力就好。

**代码**

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e6;
int a[N],pos[N],v[N],id[N];
struct node{
	int v,pos;
}p[55];//用于存放每种颜色牌第一次出现的信息

void solve(){
	int n,q,x=0;
	cin >> n >> q;
	for(int i = 1; i <= n; i ++) {
		cin >> a[i];
		if(!v[a[i]]){
			p[x++] = {a[i],i};
			v[a[i]] = 1;
		}
	}

	int t;
	while(q--){
		scanf("%d",&t);
		int xx;//保存当前查询所在的位置
		for(int i = 0; i < x; i ++){//遍历寻找
			if(p[i].v==t) {
				printf("%d ",p[i].pos);
				xx = i;
			}
		}
		
		for(int i = 0; i < x; i ++){//前面的牌位置往后移
			if(p[i].pos<p[xx].pos) p[i].pos++;
		}
		p[xx].pos = 1;//放到最前面
	}
}
int main(){
	int T;
	T = 1;
	while (T--){
		solve();
	}
	return 0;
}

```
---
## D. Min Cost String
**题意**  **构造题** 给你两个数n和k，构造一个长度为n的字符串，只能使用’a'——‘a'+k-1 的字母，使其花费最小
- 花费计算：the number of index pairs𝑖 and 𝑗 (1≤𝑖<𝑗<|𝑠|) such that 𝑠𝑖=𝑠𝑗 and 𝑠𝑖+1=𝑠𝑗+1.  就是构造出的字符串中长度为2的相同子串个数

**思路** 想要花费尽可能小，就是让子串尽可能不重复，所以就枚举长度为2的所有组合。**具体怎么枚举其实看着第一个样例模拟就好了**

**代码**

```cpp
#include<iostream>
#include<cstring> 
#include<cmath>
#include<stack>
#include<algorithm>
#include<map>
#include<vector> 
#include<queue>
#include<set>

using namespace std;
const int N = 1e5;

void solve(){
	int n, k;
	cin >> n >> k;
	int idx1=0, idx2=1;
	for(int i = 1; i <= n; i ++) {
		printf("%c",'a'+idx1);
		idx2 = idx1+1;
		while(1){
			if(idx2>k-1) break;
			if(i<n){
				printf("%c",'a'+idx1);
				i++;
			}
			if(i<n){
				printf("%c",'a'+idx2);
				i++;
			}
			idx2++;
		}
		idx1++;
		if(idx1>k-1) idx1 = 0;
	}
}
int main(){
	int T;
	T=1;
	while (T--){
		solve();
	}
	return 0;
}
```

