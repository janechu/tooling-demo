const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDir = path.resolve(__dirname, "./demo");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.tsx"),
            preview: path.resolve(appDir, "preview.ts"),
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name].js",
        },
        mode: args.mode || "development",
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
                {
                    test: /message\-system\.min\.js/,
                    use: {
                        loader: "worker-loader",
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "FAST tooling demo",
                inject: false,
                filename: "index.html",
                template: path.resolve(appDir, "index.html"),
            }),
            new HtmlWebpackPlugin({
                inject: false,
                title: "FAST tooling demo - preview",
                filename: "preview.html",
                template: path.resolve(appDir, "preview.html"),
            }),
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts", ".json"],
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            overlay: true,
            open: true,
            port: 3000,
        },
    };
};