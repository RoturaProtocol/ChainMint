# ChainMint
ChainMint(链铸)是一个基于区块链技术打造的永久记载平台。

ChainMint is a permanent recordation platform built on blockchain technology. It leverages the immutable and traceable nature of blockchain to provide a service of "minting" permanent inscriptions on-chain for users.

## 一、项目背景

为了在区块链上创建不可更改的永久记录，从而实现大数据的集成能力，我们需要开发一个记录系统。

## 二、系统功能

1. 用户登陆
    - 支持Chrome钱包登录
    - 验证用户身份
    - 返回登录会话
2. 铭文上传
    - 表单提交铭文内容
    - 支持自定义扩展字段
    - 调用智能合约将哈希存储在链上
3. 铭文记录查询
    - 支持多条件搜索查询
    - 返回查询结果列表
4. 扩展字段统计
    - 收集扩展字段数据
    - 提供扩展字段聚合分析接口

## 三、功能流程

1. 用户通过Chrome钱包扫码登录系统
2. 选择“上传铭文”功能
    - 填写铭文内容及扩展字段
    - 触发钱包签名并提交交易
3. 后台调用链上智能合约存储哈希
4. 返回上传成功页面
5. 用户选择“查询记录”功能
    - 输入查询条件查询结果
    - 返回列表页展示记录
6. 后台提供聚合接口,支持扩展字段统计


## 前端开发支持

[Front-end development support](https://github.com/RoturaProtocol/ChainMint/blob/main/Front-end%20development%20support.md)

## 后端开发支持

[Back-end development support](https://github.com/RoturaProtocol/ChainMint/blob/main/Back-end%20development%20support.md)

## 大数据开发支持

[Big-data development support](https://github.com/RoturaProtocol/ChainMint/blob/main/Big-data%20development%20support.md)

## 链上开发支持

[Chain development support](https://github.com/RoturaProtocol/ChainMint/blob/main/Chain%20development%20support.md)
