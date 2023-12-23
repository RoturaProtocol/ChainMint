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