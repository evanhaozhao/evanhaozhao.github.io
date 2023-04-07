---
title: 'MPT Part 2: Several Securities: Risk and Expected Return'
date: 2022-05-10
permalink: /posts/2022/05/MPT_Part2_several_securities/
author: "Hao Zhao"
excerpt: "<img src='/images/2022_05_10_post1/excerpt_image.svg' width='600' height='315'>"
tags:
  - MPT
  - Python
  - Visualisation
---
Modelling and visualisation on some of the financial engineering theorems using Jupyter Notebook. The mathematics of the theorems follow the book: [Capinski, M. and Zastawniak, T. (2011). Mathematics for Finance. An Introduction to Financial Engineering (Second Edition)](https://link.springer.com/gp/book/9780857290816).

Check the Jupyter Notebook in my Github repository [Python-for-mathematical-finance
](https://github.com/evanhaozhao/Python-for-mathematical-finance), or run the code in Google Colab [MPT Part 2 - Several Securities: Risk and Expected Return](https://colab.research.google.com/drive/1mw63QFL6HlsWu396ISK5nhNyKcNWRR_v?usp=sharing).

<h1>Table of Contents<span class="tocSkip"></span></h1>
<ul class="toc-item"><li><span><a href="#several-securities-risk-and-expected-return" data-toc-modified-id="Several-Securities:-Risk-and-Expected-Return-1"><span class="toc-item-num">1&nbsp;&nbsp;</span>Several Securities: Risk and Expected Return</a></span><ul class="toc-item"><li><span><a href="#porfolio-risk-and-expected-return" data-toc-modified-id="Porfolio-risk-and-expected-return-1.1"><span class="toc-item-num">1.1&nbsp;&nbsp;</span>Porfolio risk and expected return</a></span><ul class="toc-item"><li><span><a href="#theoretical-development" data-toc-modified-id="Theoretical-development-1.1.1"><span class="toc-item-num">1.1.1&nbsp;&nbsp;</span>Theoretical development</a></span></li><li><span><a href="#function-for-calculating-the-portfolio-return-and-variance" data-toc-modified-id="Function-for-calculating-the-portfolio-return-and-variance-1.1.2"><span class="toc-item-num">1.1.2&nbsp;&nbsp;</span>Function for calculating the portfolio return and variance</a></span></li><li><span><a href="#why-portfolio-diversification-can-reduce-the-unsystematic-risk" data-toc-modified-id="Why-portfolio-diversification-can-reduce-the-unsystematic-risk?-1.1.3"><span class="toc-item-num">1.1.3&nbsp;&nbsp;</span>Why portfolio diversification can reduce the unsystematic risk?</a></span></li></ul></li><li><span><a href="#minimum-variance-portfolio" data-toc-modified-id="Minimum-variance-portfolio-1.2"><span class="toc-item-num">1.2&nbsp;&nbsp;</span>Minimum variance portfolio</a></span><ul class="toc-item"><li><span><a href="#proposition-of-minimum-variance-portfolio" data-toc-modified-id="Proposition-of-minimum-variance-portfolio-1.2.1"><span class="toc-item-num">1.2.1&nbsp;&nbsp;</span>Proposition of minimum variance portfolio</a></span></li><li><span><a href="#function-for-calculating-the-weights-of-mvp" data-toc-modified-id="Function-for-calculating-the-weights-of-MVP-1.2.2"><span class="toc-item-num">1.2.2&nbsp;&nbsp;</span>Function for calculating the weights of MVP</a></span></li></ul></li></ul></li></ul>

# Several Securities: Risk and Expected Return


```python
import numpy as np
import pandas as pd
import pandas_datareader as pdr
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import random
from tqdm.notebook import tqdm
tqdm.pandas()
```

## Porfolio risk and expected return

### Theoretical development

For the portfolio constructed by $n$ different securities, the weight for security $i$ is:

$$
\begin{equation*}
    w_i = \frac{x_iS_i(0)}{V(0)}, i = 1, 2, ..., n.
\end{equation*}
$$

Here $x_i$ is the amount of security $i$ in the portfolio, $S_i(0)$ is the initial price of security $i$, $V(0)$ is the initial amount of investment in the portfolio. The weight can be expressed as:

$$
\begin{equation*}
    \mathrm{w} = 
    \begin{bmatrix}  
        w_1 & w_2 & ... & w_n
    \end{bmatrix}.
\end{equation*}
$$

The sum of weights equal zero, as:

$$
\begin{equation}
    1 = \mathrm{w}\mathrm{u}^T,
    \mathrm{u} = 
    \begin{bmatrix}
        1 & 1 & ... & 1
    \end{bmatrix}.
\end{equation}
$$

The stock returns in the feasible portfolio are $K_1,...,K_n$, and the expected returns are $\mu_i = E(K_i)$, $i=1,2,...n$:

$$
\begin{equation*}
    \mathrm{m}=
    \begin{bmatrix}
        \mu_1 & \mu_2 & ... & \mu_n
    \end{bmatrix}.
\end{equation*}
$$

The covariance between two stock returns is expressed as $c_{ij} = Cov(K_i,K_j)$, or in $n\times n$ covariance matrix:

$$
\begin{equation*}
    \mathrm{C} =
    \begin{bmatrix}
        c_{11}&c_{12}&\cdots&c_{1n}\\
        c_{21}&c_{22}&\cdots&c_{2n}\\
        \vdots & \vdots & \ddots & \vdots\\
        c_{n1}&c_{n2}&\cdots&c_{nn}\\
    \end{bmatrix}.
\end{equation*}
$$

The diagonal elements of the matrix are the variance of the stock return, $c_{ii}=\sigma_i^2=Var(K_i)$.

The expected return and the variance of the portfolio are:

$$
\begin{equation}
    \mu_V = \mathrm{w}\mathrm{m}^T,
\end{equation}
$$

$$
\begin{equation}
    \sigma_V^2 = \mathrm{w}\mathrm{C}\mathrm{w}^T
\end{equation}
$$

<i>Proof</i>

$$
\begin{equation*}
    \mu_V = E(K_V) = E(\sum_{i=1}^nw_iK_i) = \sum_{i=1}^nw_i\mu_i = \mathrm{w}\mathrm{m}^T
\end{equation*}
$$

$$
\begin{align*}
    \sigma_V^2 & = Var(K_V) = Var(\sum_{i=1}^nw_iK_i) \\
        &= Cov(\sum_{i=1}^nw_iK_i, \sum_{j=1}^nw_jK_j) = \sum_{i,j=1}^nw_iw_jc_{ij} \\
        &= \mathrm{w}\mathrm{C}\mathrm{w}^T
    \end{align*}
$$

<p style="text-align:right;"><span class="qed-square"></span></p>

### Function for calculating the portfolio return and variance

**Description of** `calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=True)`:

Use lists of securities' weights, expected returns, standard deviations, and pearson correlations to calculate the portfolio's expected return and variance, and standard deviation.

**Keyword arguments**:

- `print_results=True`: default is `True`, will print the portfolio's expected return, variance/standard deviation, and the percentage of idiosyncratic variances out of the portfolio variance. If `False`, will not print anything, but return a dictionary containing the portfolio return, variance, standard deviation, and the proportion of diagonal variances.

- `print_var=True`: default is `True`, when `print_results=True`, print the portfolio variance, if `print_var=False`, print the portfolio standard deviation.



```python
def calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=True, print_var=True):
    
    port_eret = np.dot(np.array(weight_list), np.array(eret_list).transpose())
    
    cov_mat = []
    n = len(std_list)
    for x in range(1,n+1):
        cxy= []
        for y in range(1,n+1):
            if x == y:   
                cxy.append(std_list[x-1]**2)
            elif x < y:
                idx = int((y-x-1)*n-(((y-x)*(y-x-1))/2)+x)
                cxy.append(corr_list[idx-1]*std_list[x-1]*std_list[y-1])
            elif x > y:
                idx = int((x-y-1)*n-(((x-y)*(x-y-1))/2)+y)
                cxy.append(corr_list[idx-1]*std_list[x-1]*std_list[y-1])
        
        cov_mat.append(cxy)
        
    port_var = np.dot(np.dot(weight_list, cov_mat), np.array(weight_list).transpose())
    port_sd = np.sqrt(port_var)
    msv = sum(map(lambda x: x**2, std_list))/(n**2)
    if print_results:
        print("The portfolio's expected return is: %s" % round(port_eret, 4))
        if print_var:
            print("The portfolio's variance is %s" % round(port_var,4))
        else:
            print("The portfolio's standard deviation is %s" % round(port_sd,4))
        print("The idiosyncratic variances account for %s%% of the portfolio variance" % round((msv/port_var)*100,2))
    else:
        vola_dict = dict()
        vola_dict["return"] = port_eret
        vola_dict["variance"] = port_var
        vola_dict["std"] = port_sd
        vola_dict["diagvar"] = msv/port_var
        
        return vola_dict
     
```


**Note**: in order to use the above function, some conditions must be met:
<a id="note_corr_list"></a>

1. All the inputs are list, and in order: stock 1, stock 2, ... , stock n.
2. The lengths of weight_list, eret_list, and std_list should be equal to $n$.
3. The lengh of corr_list equals to $\frac{n!}{2(n-2)!}$.
4. Unlike the codes in Part 1, here the input is the standard deviation rather than variance.
4. The correlation list should follow the combination order from smaller distance between $i$ and $j$ to larger, for example, if $n = 4$:

$$
\begin{equation*}
\begin{bmatrix}
    \rho_{12} & \rho_{23} & \rho_{34} & \rho_{13} & \rho_{24} & \rho_{14}
\end{bmatrix}
\end{equation*}
$$

Then, the code will build the covariance matrix using $C_{ij} = \rho_{ij}\sigma_{i}\sigma_{j}$ to calculate the covariance for each $i$ and $j$ pair ($i\neq j$). Assuming the index for correlation list starts from 1 instead of 0. For the $n\times n$ covariance matrix, the following equation is used in the above function to identify the index correlation list for the pair $i,j$:

$$
\begin{equation*}
    \mathrm{index} = (|i-j|-1)n-\frac{|i-j|}{2}(|i-j|-1)+min(i,j)
\end{equation*}
$$

```python
weight_list = [0.4, -0.2, 0.8]
eret_list = [0.08, 0.1, 0.06]
std_list = [0.15, 0.05, 0.12]
corr_list = [0.3, 0, -0.2]

calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=True, print_var=False)
calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=False)
```

    The portfolio's expected return is: 0.06
    The portfolio's standard deviation is 0.1013
    The idiosyncratic variances account for 42.7% of the portfolio variance

    {'return': 0.06,
     'variance': 0.010252,
     'std': 0.10125216047077712,
     'diagvar': 0.4270169506221008}



### Why portfolio diversification can reduce the unsystematic risk?

Assume the stocks in the portfolio are equal-weighted, which means $w_i=\frac{1}{n}$. If the portfolio is diversified enough ($n \to \infty$), the unsystematic risk of individual security will be eliminated. The systematic risk will remain. This statement under such assumption can be proved as follow:

<i>Proof</i>

$$
\begin{align*}
    \sigma_V^2 &= \frac{1}{n^2}\sum_{i=1}^nVar(K_i) + \frac{1}{n^2}\sum_{i,j=1; i\neq j}^nCov(K_i, K_j) \\
        &= \frac{1}{n}\frac{1}{n}\sum_{i=1}^nVar(K_i) + \frac{n^2-n}{n^2}\frac{1}{n^2-n}\sum_{i,j=1; i\neq j}^nCov(K_i, K_j) \\
        &= \frac{1}{n}E[Var(K_i))] + \frac{n^2-n}{n^2}E[Cov(K_i, K_j)]
\end{align*}
$$

In a well-diversified portfolio, when $n \to \infty$, $\frac{1}{n} \to 0$ and $\frac{n^2-n}{n^2} \to 1$. Therefore, only the covariance contributes to the volatility ($\sigma_V$) of such well-diversified portfolio.

<p style="text-align:right;"><span class="qed-square"></span></p>

**Description** of `plot_corr_matrix(n_sample, dataframe, plot_heat=True)`:

Randomly select a number of sample from a time-series financial return data with every column for every stock, print the number of stocks, equal-weighted portfolio expected return, equal-weighted portfolio standard deviation, and the percentage decrease in the portfolio variance, and plot `seaborn.heatmap` for the portfolio's correlation matrix. When keyword argument `plot_heat=False`, will only return a dictionary containing the portfolio return, variance, and standard deviation.

**Arguments**:

- `n_sample` (type: int): number of sample that are randomly selected from the data set. If exceed the index range of data set, `n_sample` will equal the length of the data set minus 10 (or equal 1 if still out of index range).

- `dataframe` (type: Pandas DataFrame): read from the link to the Github raw file "[crsp_small_sample.xlsx](https://github.com/evanhaozhao/Python-for-mathematical-finance/blob/main/data/crsp_small_sample.xlsx)". The file is a small time-series sample containing 906 CRSP monthly stock returns randomly selected from all industries (excl. financial) as columns, from January 2010 to December 2020.

- `plot_heat=True`: default is `True`, will plot `seaborn.heatmap` for the portfolio's correlation matrix, and print the number of stocks, equal-weighted portfolio expected return, equal-weighted portfolio standard deviation, and the percentage of idiosyncratic variances out of the portfolio variance. If `False`, will only return a dictionary containing the portfolio return, variance, standard deviation, and the proportion of diagonal variances.



```python
def plot_corr_matrix(n_sample, dataframe, plot_heat=True):
    df = dataframe 
    if n_sample < len(df.columns) and n_sample > 0:
        num = n_sample
    else:
        try:
            num = len(df.columns) - 10
        except:
            num = 1
        print("[Error] number out of range. Plot default sample.")

    df_sample = pd.concat([df["yrm"], df.loc[:,df.columns!="yrm"].sample(n=num,axis='columns',replace=False)], axis=1)
    weight_list = [1/(len(df_sample.columns)-1)] * (len(df_sample.columns)-1)
    eret_list = [df_sample[df_sample.columns[i]].mean() for i in range(1, len(df_sample.columns))]
    std_list = [df_sample[df_sample.columns[i]].std() for i in range(1, len(df_sample.columns))]
    corr_list = []
    for distance in range(1, len(df_sample.columns)-1):
        i = 1
        next_i = i + distance
        while next_i <= len(df_sample.columns)-1:
            correlation = df_sample[df_sample.columns[i]].corr(df_sample[df_sample.columns[next_i]])
            corr_list.append(correlation)
            i += 1
            next_i = i + distance
    if plot_heat:
        print("Number of stocks in the EW portfolio: %s" % num)
        calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=True, print_var=False)
        corr_mat = df_sample.corr()
        f = plt.figure(figsize = (10,6))
        ax = sns.heatmap(corr_mat)
        plt.show()
    else:
        return calc_port_retvar(weight_list, eret_list, std_list, corr_list, print_results=False)

```

**Heatmaps of correlation matrix**

First, we can plot a series of **correlation matrix heatmaps for different number of stocks in the portfolio**. `numList` contains a list of the number of stocks that will be randomly selected from the main dataset into the portfolio. 

The plots below shows the proportion of idiosyncratic volatility (indicated by the diagonal light color squares) is decreasing when there are more and more stocks in the portfolio, consistent with the statement that only the covariance contributes to the volatility of an ideally well-diversified portfolio ($n \to \infty$)


```python
numList = [2, 3, 5, 12, 30, 100, 300, 900]
sample_url = "https://raw.github.com/evanhaozhao/Python-for-mathematical-finance/main/data/crsp_small_sample.xlsx"
df = pd.read_excel(sample_url)
for n_sample in tqdm(numList):
    plot_corr_matrix(n_sample, df, plot_heat=True)
    
```

    Number of stocks in the EW portfolio: 2
    The portfolio's expected return is: 0.0112
    The portfolio's standard deviation is 0.1054
    The idiosyncratic variances account for 89.06% of the portfolio variance



<p align="center">    
<img src='/images/2022_05_10_post1/output_12_2.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 3
    The portfolio's expected return is: 0.0075
    The portfolio's standard deviation is 0.0942
    The idiosyncratic variances account for 73.58% of the portfolio variance



<p align="center">    
<img src='/images/2022_05_10_post1/output_12_4.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 5
    The portfolio's expected return is: 0.0132
    The portfolio's standard deviation is 0.0715
    The idiosyncratic variances account for 49.05% of the portfolio variance



<p align="center">    
<img src='/images/2022_05_10_post1/output_12_6.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 12
    The portfolio's expected return is: 0.0169
    The portfolio's standard deviation is 0.0741
    The idiosyncratic variances account for 25.33% of the portfolio variance



<p align="center">    
<img src='/images/2022_05_10_post1/output_12_8.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 30
    The portfolio's expected return is: 0.0177
    The portfolio's standard deviation is 0.0553
    The idiosyncratic variances account for 19.1% of the portfolio variance



<p align="center">    
<img src='/images/2022_05_10_post1/output_12_10.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 100
    The portfolio's expected return is: 0.0152
    The portfolio's standard deviation is 0.0546
    The idiosyncratic variances account for 6.25% of the portfolio variance



<p align="center">     
<img src='/images/2022_05_10_post1/output_12_12.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 300
    The portfolio's expected return is: 0.0138
    The portfolio's standard deviation is 0.0572
    The idiosyncratic variances account for 1.85% of the portfolio variance



<p align="center">     
<img src='/images/2022_05_10_post1/output_12_14.png' width='600' height='315'>
</p>    


    Number of stocks in the EW portfolio: 900
    The portfolio's expected return is: 0.0135
    The portfolio's standard deviation is 0.0559
    The idiosyncratic variances account for 0.62% of the portfolio variance



<p align="center">     
<img src='/images/2022_05_10_post1/output_12_16.png' width='600' height='315'>
</p>    


**Random selection for number of stocks**

Use below cell to test the random sample selection function of `plot_corr_matrix` with `plot_heat=False`, under which circumstance the output of `plot_corr_matrix` is a dictionary.


```python
plot_corr_matrix(10, df, plot_heat=False)
```




    {'return': 0.013411779090496238,
     'variance': 0.004974473748940599,
     'std': 0.07052994930482084,
     'diagvar': 0.3784352862914476}



To further illustrate the effect of diversification on variance, we construct a DataFrame called `df_retvar` with each row as a portfolio consisting of different number of stocks randomly selected from the previous CRSP sample file.


```python
list_ret_var = []
for i in tqdm(range(2,300,5)):
    dict_ret_var = plot_corr_matrix(i, df, plot_heat=False)
    dict_ret_var["num_stock"] = i
    list_ret_var.append(dict_ret_var)

df_retvar = pd.DataFrame(list_ret_var)
df_retvar.head(10)
```






<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>return</th>
      <th>variance</th>
      <th>std</th>
      <th>diagvar</th>
      <th>num_stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.012502</td>
      <td>0.009062</td>
      <td>0.095192</td>
      <td>0.934812</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0.014243</td>
      <td>0.006508</td>
      <td>0.080669</td>
      <td>0.515348</td>
      <td>7</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.018026</td>
      <td>0.004661</td>
      <td>0.068269</td>
      <td>0.502222</td>
      <td>12</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0.019046</td>
      <td>0.003799</td>
      <td>0.061633</td>
      <td>0.298044</td>
      <td>17</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0.014085</td>
      <td>0.003250</td>
      <td>0.057006</td>
      <td>0.167664</td>
      <td>22</td>
    </tr>
    <tr>
      <th>5</th>
      <td>0.016742</td>
      <td>0.004234</td>
      <td>0.065068</td>
      <td>0.163414</td>
      <td>27</td>
    </tr>
    <tr>
      <th>6</th>
      <td>0.014426</td>
      <td>0.004853</td>
      <td>0.069664</td>
      <td>0.137153</td>
      <td>32</td>
    </tr>
    <tr>
      <th>7</th>
      <td>0.012808</td>
      <td>0.003722</td>
      <td>0.061010</td>
      <td>0.109052</td>
      <td>37</td>
    </tr>
    <tr>
      <th>8</th>
      <td>0.013808</td>
      <td>0.002744</td>
      <td>0.052387</td>
      <td>0.120151</td>
      <td>42</td>
    </tr>
    <tr>
      <th>9</th>
      <td>0.013791</td>
      <td>0.003035</td>
      <td>0.055090</td>
      <td>0.102587</td>
      <td>47</td>
    </tr>
  </tbody>
</table>
</div>



**Volatility line chart**

From the line chart below, we observe when the number of stocks in the portfolio increase, the portfolio's volatility and the proportion of idiosyncratic variance decrease.


```python
col_dict = {"variance":"Portfolio variance", "std": "Portfolio standard deviation", \
               "diagvar": "Proportion of idiosyncratic variances"}
for k, v in col_dict.items():
    f = plt.figure(figsize=(10, 4))
    color = random.choice(list(mcolors.TABLEAU_COLORS.values()))
    plt.plot("num_stock", k, data=df_retvar, c=color, ls='-', lw=2)
    plt.xlabel("Number of stocks in the portfolio")
    plt.ylabel("%s" % v)
    plt.show()
```


<p align="center">    
<img src='/images/2022_05_10_post1/output_18_0.png' width='600' height='315'>
</p>    



<p align="center">    
<img src='/images/2022_05_10_post1/output_18_1.png' width='600' height='315'>
</p>    



<p align="center">    
<img src='/images/2022_05_10_post1/output_18_2.png' width='600' height='315'>
</p>    


## Minimum variance portfolio



### Proposition of minimum variance portfolio

Assume $\mathrm{det}$ $\mathrm{C} \neq 0$, the portfolio with the smallest variance in the attainable set has weights:

$$
\begin{equation}
    \mathrm{w} = \frac{\mathrm{uC}^{-1}}{\mathrm{uC}^{-1}\mathrm{u}^T}
\end{equation}
$$

<i>Proof</i>

We need to find the minimum of the portfolio variance $\sigma_V^2 = \mathrm{w}\mathrm{C}\mathrm{w}^T$ subject to the constraint $\mathrm{w}\mathrm{u}^T=1$. To this end we can use the method of Lagrange multipliers:

$$
\begin{align*}
    \mathrm{F}(\mathrm{w},\lambda) = \mathrm{w}\mathrm{C}\mathrm{w}^T − \lambda(\mathrm{w}\mathrm{u}^T-1),
\end{align*}
$$

where $\lambda$ is a Lagrange multiplier. Equating to zero the partial derivatives of $F$ with respect to the weights $w_i$ we obtain $2\mathrm{w}\mathrm{C} − \lambda \mathrm{u} = 0$, that is:

$$
\begin{align*}
    \mathrm{w}=\frac{\lambda}{2}\mathrm{u}\mathrm{C}^{-1},
\end{align*}
$$

which is a necessary condition for a minimum. Substituting this into constraint $\mathrm{w}\mathrm{u}^T=1$, we obtain:

$$
\begin{align*}
    \frac{\lambda}{2}\mathrm{u}\mathrm{C}^{-1}\mathrm{u}^T=1,
\end{align*}
$$

where we use the fact that $\mathrm{C}^{−1}$ is a symmetric matrix because $C$ is. Solving this for $\lambda$ and substituting the result into the expression for $\mathrm{w}$ will give the asserted formula.

<p style="text-align:right;"><span class="qed-square"></span></p>

### Function for calculating the weights of MVP

Below is the function to calculate the weights, return, and variance of the minimum variance portfolio.

**Description** of `cal_mvp(eret_list, std_list, corr_list, return_type="weight_list")`:

**Arguments**

- `eret_list`, `std_list`, `corr_list`: like what we did before, these three parameters are lists of stock returns, standard deviations, and correlations (*see* previous [Note](#note_corr_list) for the required correlation order in the list)
- `return_type="weight_list"`: default is to return a list of weights with minimum portfolio variance. Besides, there are two options: `"full_print"` to print the minimum variance portfolio's weights, return and variance; `"dictionary"` to return a dictionary of the minimum variance portfolio's return and variance.


```python
def cal_mvp(eret_list, std_list, corr_list, return_type="weight_list"):
    
    cov_mat = []
    n = len(std_list)
    u = np.array([1] * n)
    for x in range(1,n+1):
        cxy= []
        for y in range(1,n+1):
            if x == y:   
                cxy.append(std_list[x-1]**2)
            elif x < y:
                idx = int((y-x-1)*n-(((y-x)*(y-x-1))/2)+x)
                cxy.append(corr_list[idx-1]*std_list[x-1]*std_list[y-1])
            elif x > y:
                idx = int((x-y-1)*n-(((x-y)*(x-y-1))/2)+y)
                cxy.append(corr_list[idx-1]*std_list[x-1]*std_list[y-1])
        cov_mat.append(cxy)
    
    weight_array = np.dot(u,np.linalg.inv(cov_mat))/np.dot(np.dot(u,np.linalg.inv(cov_mat)),u.transpose())
    weight_list = list(weight_array)
    port_eret = np.dot(np.array(weight_list), np.array(eret_list).transpose())
    port_var = np.dot(np.dot(weight_list, cov_mat), np.array(weight_list).transpose())
    if return_type == "weight_list":
        return weight_list
    elif return_type == "full_print":
        weight_round = list(np.round(weight_array,3))
        print("Weights for the minimum variance portfolio are: %s, sum to %s" %(weight_round, round(np.sum(weight_array),0)))
        print("The portfolio's expected return is: %s" % round(port_eret, 4))
        print("The portfolio's variance is %s" % round(port_var,4))
        try:
            print("The portfolio's standard deviation is %s" % round(np.sqrt(port_var),4))
        except:
            pass
    elif return_type == "dictionary":
        vola_dict = dict()
        vola_dict["return"] = port_eret
        vola_dict["variance"] = port_var
        
        return vola_dict
  
```


```python
eret_list = [0.2, 0.13, 0.17]
std_list = [0.25, 0.28, 0.2]
corr_list = [0.3, 0, 0.15]

cal_mvp(eret_list, std_list, corr_list, return_type="full_print")
```

    Weights for the minimum variance portfolio are: [0.228, 0.235, 0.537], sum to 1
    The portfolio's expected return is: 0.1674
    The portfolio's variance is 0.0232
    The portfolio's standard deviation is 0.1523



```python
def calSampleMVP(n_sample, dataframe, return_dict=False):
    df = dataframe 
    if n_sample < len(df.columns) and n_sample > 0:
        num = n_sample
    else:
        try:
            num = len(df.columns) - 10
        except:
            num = 1
        print("[Error] number out of range. Plot default sample.")
    
    df_sample = pd.concat([df["yrm"], df.loc[:,df.columns!="yrm"].sample(n=num,axis='columns',replace=False)], axis=1)
    corr_list = []
    for distance in range(1, len(df_sample.columns)-1):
        i = 1
        next_i = i + distance
        while next_i <= len(df_sample.columns)-1:
            correlation = df_sample[df_sample.columns[i]].corr(df_sample[df_sample.columns[next_i]])
            corr_list.append(correlation)
            i += 1
            next_i = i + distance
    eret_list = [df_sample[df_sample.columns[i]].mean() for i in range(1, len(df_sample.columns))]
    std_list = [df_sample[df_sample.columns[i]].std() for i in range(1, len(df_sample.columns))]
    weight_list = cal_mvp(eret_list, std_list, corr_list, return_type="weight_list")
    if return_dict:
        return cal_mvp(eret_list, std_list, corr_list, return_type="dictionary")
    else:
        return cal_mvp(eret_list, std_list, corr_list, return_type="full_print")
            
```


```python
calSampleMVP(20, df, return_dict=False)
```

    Weights for the minimum variance portfolio are: [0.11, -0.03, 0.332, 0.198, -0.076, 0.242, 0.022, -0.031, -0.006, -0.031, -0.004, 0.107, -0.076, -0.003, 0.038, 0.157, 0.008, -0.002, 0.019, 0.026], sum to 1
    The portfolio's expected return is: 0.0128
    The portfolio's variance is 0.0014
    The portfolio's standard deviation is 0.0372



```python
listMVP = []
for i in tqdm(range(2,300,5)):
    dictMVP = calSampleMVP(i, df, return_dict=True)
    dictMVP["num_stock"] = i
    listMVP.append(dictMVP)

df_mvp = pd.DataFrame(listMVP).rename(columns={"return":"return_mvp","variance":"variance_mvp"})
df_mvp.head(10)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>return_mvp</th>
      <th>variance_mvp</th>
      <th>num_stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.021523</td>
      <td>0.008861</td>
      <td>2</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0.021569</td>
      <td>0.004338</td>
      <td>7</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.008988</td>
      <td>0.001278</td>
      <td>12</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0.013424</td>
      <td>0.001106</td>
      <td>17</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0.013455</td>
      <td>0.001170</td>
      <td>22</td>
    </tr>
    <tr>
      <th>5</th>
      <td>0.011322</td>
      <td>0.001348</td>
      <td>27</td>
    </tr>
    <tr>
      <th>6</th>
      <td>0.012898</td>
      <td>0.001158</td>
      <td>32</td>
    </tr>
    <tr>
      <th>7</th>
      <td>0.013765</td>
      <td>0.000795</td>
      <td>37</td>
    </tr>
    <tr>
      <th>8</th>
      <td>0.013728</td>
      <td>0.000667</td>
      <td>42</td>
    </tr>
    <tr>
      <th>9</th>
      <td>0.012839</td>
      <td>0.000811</td>
      <td>47</td>
    </tr>
  </tbody>
</table>
</div>



We can plot portfolio variance and return of different portfolio weights. Blue portfolios are equal weighted, while orange portfolios are weighted by minimum variance weights.


```python
f = plt.figure(figsize=(10,5))
plt.scatter("variance", "return", data=df_retvar)
plt.scatter("variance_mvp", "return_mvp", data=df_mvp)
plt.xlim(0,0.005)
plt.ylim(0,0.02)
plt.xlabel("Portfolio variance")
plt.ylabel("Portfolio return")
plt.legend()
plt.show()
```


<p align="center">    
<img src='/images/2022_05_10_post1/output_27_0.png' width='600' height='315'>
</p>    

