---
title: 'Toolkit for Empirical Workflows in Stata'
date: 2023-08-19
permalink: /posts/2023/08/stata_corp_fin/
author: "Hao Zhao"
excerpt: "<img src='/images/2023_08_19_post/stata_command.png' width='600' height='315'>"
tags:
  - Empirical analysis
  - Stata
  - Ado
---

`corp_fin` is a collection of Stata commands designed to streamline common tasks in empirical corporate finance research. The goal is simple: automate the repetitive processes such as running regressions, testing coefficients, doing univariate analyses, while producing clean, ready-to-use output.

This package started as a set of practical solutions to two recurring needs I built to simplify my work:  
(1) moving quickly from a model setup to a presentable output table with minimal code, and  
(2) performing structured coefficient-level analysis & output using concise and consistent commands.

The latest version: [github.com/evanhaozhao/corp-fin-ado-toolkit](https://github.com/evanhaozhao/corp-fin-ado-toolkit)

---

## Modules

- Last modified: April 19, 2025

`regx`

Command mainly supports:
- `regress`, `xtreg`, `reghdfe`, `coefplot`, `tobit`, `poisson`, and `ppmlhdfe`
- Multiple dependent and independent variables
- Rotating independent variables or controls
- Interaction and dynamic event-study terms
- Assessing and reporting table overall significance
- Exporting estimates in row-based format for further processing
- High-dimensional fixed effects
- Clustered standard errors
- Custom titles, notes, and export folders

`eqx`

Command for exporting coefficient equality test. It supports:
- Within-model tests, such as comparing `x1` and `x2`
- Cross-group comparisons using a categorical variable
- Between-model comparisons

`sumx`

Command for exporting summary statistics and t-test tables. Main features include:
- One-sample and two-sample t-tests
- Grouped summaries using a categorical variable
- Presentation-style output with means, medians, differences, and p-values

---

## Installation

To install or update the package, run the following in Stata:

```
net install corp_fin, from(https://raw.github.com/evanhaozhao/corp-fin-ado-toolkit/main) replace
```

---

## Help Files

In Stata, type:

```
help regx
help eqx
help sumx
```

These commands display the syntax and list of options.

---

## Notes on Usage

- To specify standard error clustering, define a global variable `clustervar` before using `regx` or `eqx`. If this is not set, standard errors default to robust.
- To control the output directory for exported tables, define a global `dir_table_flow`. The current output formats include `.csv` and `.rtf`.
