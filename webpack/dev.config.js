const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
// importLoader:1 from https://blog.madewithenvy.com/webpack-2-postcss-cssnext-fdcd2fd7d0bd

const varPath = path.join(
    __dirname,
    "..",
    "src",
    "static",
    "styles",
    "config",
    "_variables.scss"
);

// This is total BS. Path join on windows returns \, however this is
// then escaped by something in the path of the sass loader. Switching
// everything to forward slashes and the whole thing just works..
varPathWindows = varPath.replace(/\\/g, "/");

module.exports = {
    devtool: "source-map", // 'cheap-module-eval-source-map'
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require("autoprefixer")]
                        }
                    }
                ])
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    },
                    // Bulma uses autoprefixing to try and fix flexbox for earlier
                    // browser versions so we need that here
                    // https://github.com/postcss/postcss-loader/issues/204.
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require("autoprefixer")]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            data: `@import "${varPathWindows}";`
                        }
                    }
                ])
            }
        ]
    },
    plugins: [new ExtractTextPlugin("styles/[name].css")]
};
