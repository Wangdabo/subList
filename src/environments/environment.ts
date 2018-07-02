// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    chore: false, // ng-alain 开发标记，你可以删除它
    SERVER_URL: `./`, // 所有HTTP请求的前缀
    production: false, // 是否生产环境
    hmr: false, // 是否HMR启动
    useHash: true   //  路由是否useHash模式
};
