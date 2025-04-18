import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionCache from '../src/createEmotionCache';
import createEmotionServer from '@emotion/server/create-instance';

export default class AppDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="theme-color" content="#1976d2" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

AppDocument.getInitialProps111 = async (ctx) => {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function enhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });
        
    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => {
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            dangerouslySetInnerHTML={{__html: style.css}}
        />
    })

    return {
        ...initialProps,
        emotionStyleTags
    }

}

