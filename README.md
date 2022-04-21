## 说明

该博客用gatsby创建

链接：

[gatsby英文文档](https://www.gatsbyjs.org/docs/)

[gatsby中文文档](https://www.gatsbyjs.cn/docs/)

## 使用

### 使用cli工具
利用[cli工具](https://www.gatsbyjs.org/docs/quick-start)启动
```
# npm install -g gatsby-cli
```

开发:

```
# gatsby develop
```

生成静态页面:

```
# gatsby build
# gatsby serve
```

### 使用npm script

```
"scripts": {
  "init": "npm install -g gatsby-cli",
  "dev": "gatsby develop",
  "lint": "eslint --ext .js,.jsx --ignore-pattern public .",
  "test": "echo \"Write tests! -> https://gatsby.app/unit-testing\"",
  "format": "prettier --trailing-comma es5 --no-semi --single-quote --write 'src/**/*.js' 'src/**/*.md'",
  "develop": "gatsby develop",
  "start": "npm run develop",
  "build": "gatsby build",
  "fix-semi": "eslint --quiet --ignore-pattern node_modules --ignore-pattern public --parser babel-eslint --no-eslintrc --rule '{\"semi\": [2, \"never\"], \"no-extra-semi\": [2]}' --fix gatsby-node.js"
}
```

安装环境：`npm run init`

开发：`npm start` 或 `npm run dev`

生成静态页面：`npm run build`

格式化代码：`npm run format`

## 部署

如何部署在github上，参考：

https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/

根据本项目的情况：

> 安装gh-pages开发依赖
>  ```
>  npm install gh-pages --save-dev
>  ```
> 添加npm script
>  ```
>  "scripts": {
>    "deploy": "gatsby build --prefix-paths && gh-pages -r https://github.com/ldc4/blog.git -d public"
>  }
>  ```

## TODO

- [x] 分类页面
- [x] 标签页面
- [x] 关于页面
- [x] 导航配置化
- [x] 文章列表分页
- [x] 草稿标识

## 注意事项

- 启动时请保持和安装npm包的node版本一致，避免报错
- node版本 >= 12.13.0 (推荐使用v14+)
