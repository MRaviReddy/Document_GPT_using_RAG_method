const next = require('next');
const { parse } = require('url');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev });
const handle = app.getRequestHandler();

const port = 3000;

let registery = {
    "mappings": {
        "/": "/chatbot",
        "": "/chatbot", // default mapping        
    }
}

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            const { pathname, query } = parsedUrl;
            let endpoint = pathname
            if (Object.keys(registery.mappings).includes(endpoint)) {
                let resolvedPath = registery.mappings[endpoint];                
                app.render(req, res, resolvedPath, query)
            } else {
                req.url = req.url
                handle(req, res)
            }
        } catch (error) {
            console.log(error)
            res.statusCode = 500;
            red.end('Internal Server Error')
        }

    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});