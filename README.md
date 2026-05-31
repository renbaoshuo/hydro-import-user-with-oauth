# hydro-import-user-with-oauth

Hydro 插件：在用户导入（import）时自动绑定 OAuth 账号。

## 功能

在批量导入用户时，自动为新用户绑定 OAuth 账号。若某个 OAuth 账号已被其他用户占用，将跳过而非覆盖。

## 安装

```bash
hydrooj install hydro-import-user-with-oauth
```

之后使用 pm2 重启 Hydro：

```bash
pm2 restart hydrooj
```

## 使用

安装后插件自动生效，无需额外配置。只需在导入数据的 `extra` 列中加入 `oauth` 字段即可。

> Hydro 导入格式为每行一个用户，各列以 Tab 或逗号分隔：
>
> ```tsv
> email	username	password	displayName	extra
> ```
>
> 其中 `extra` 列为 JSON 字符串，在其中加入 `oauth` 字段即可绑定 OAuth 账号。

### 示例

绑定单个平台：

```tsv
user@example.com	user1	123456	张三	{"oauth":{"github":"12345"}}
```

绑定多个平台：

```tsv
user@example.com	user1	123456	张三	{"oauth":{"github":"12345","google":"67890"}}
```

与其他 extra 字段组合使用：

```tsv
user@example.com	user1	123456	张三	{"oauth":{"github":"12345"},"group":"classA"}
```

### OAuth 字段格式

`oauth` 字段支持以下三种格式：

| 格式         | 示例                                   |
| ------------ | -------------------------------------- |
| 字典（推荐） | `{"github":"12345","google":"67890"}`  |
| 数组         | `[{"platform":"github","id":"12345"}]` |
| 单对象       | `{"platform":"github","id":"12345"}`   |

## 工作原理

```text
用户导入 → Hydro 触发 user/import/create 事件
    → 本插件解析 udoc.oauth 字段
    → 对每个绑定：检查是否已存在
        → 不存在或属于同一用户 → oauth.set(platform, id, uid)
        → 已属于其他用户 → 跳过
```

## Author

**hydro-import-user-with-oauth** © [Baoshuo](https://github.com/renbaoshuo), Released under the [MIT](https://github.com/renbaoshuo/hydro-import-user-with-oauth/blob/master/LICENSE) License.

> [Personal Website](https://baoshuo.ren) · [Blog](https://blog.baoshuo.ren) · GitHub [@renbaoshuo](https://github.com/renbaoshuo)
