const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

router.get('/', function (req, res, next) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig);

            res.setHeader('Content-Type', 'text/html');
            res.write(`
                <link href="/style.css" rel="stylesheet">
                <style>
                    @keyframes slide-up {
                        from {
                            transform: translateY(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    .animate-slide-up {
                        animation: slide-up 0.3s ease-out forwards;
                    }
                </style>
                <body class="bg-slate-600 h-screen">
                <nav class="text-white z-10 w-full flex justify-around items-center bg-slate-700 p-5 text-2xl">
                    <a class="opacity-100 p-3 hover:opacity-100 t200e text-center text-6xl w-3/4" href="/">PC8th</a>
                    <div class="flex justify-center w-full">
                        <a href="/" class="relative group p-3">
                            <div class="opacity-50 group-hover:opacity-100 t200e">Home</div>
                            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 t200e"></div>
                        </a>
                    </div>
                </nav>

                <div class="container w-full mx-auto px-4 py-12 opacity-0 animate-fade-in-instant">
                    <div class="text-center mb-12">
                        <h1 class="title mb-4">Database Loader</h1>
                        <p class="text-slate-300 text-xl">
                            Initializing Database... 
                        </p>
                        <p class="text-slate-300 text-xl">
                            <span id="countdown" class="font-bold">60</span> commands remaining
                            <br>
                            ${req.session.visitedFromAdmin ? `
                                <span class="text-md">
                                You will be redirected back to admin dashboard soon...
                                </span>` : ''}
                        </p>

                        
                    </div>


                    <div class="mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div class="grid grid-cols-12 gap-4 bg-slate-900 p-6 border-b border-slate-700">
                            <div class="text-lg font-semibold text-white px-6 col-span-6">Command</div>
                            <div class="text-lg font-semibold text-white px-6 col-span-3">Status</div>
                            <div class="text-lg font-semibold text-white px-6 col-span-3">Result</div>
                        </div>

                        <div id="commandsContainer" class="flex flex-col-reverse divide-y divide-y-reverse divide-slate-700">
            `);

            let data = fs.readFileSync("./ddl/SQLServer_shop.ddl", { encoding: 'utf8' });
            let commands = data.split(";");
            let totalCommands = commands.filter(cmd => cmd.trim()).length;
            let timePerCommand = 60 / totalCommands;
            let timeLeft = 60;

            // Inside the commands loop, replace the static countdown with dynamic updates:
            for (let i = 0; i < commands.length; i++) {
                let command = commands[i].trim();
                if (!command) continue;

                // Update countdown based on completed commands
                timeLeft = Math.ceil((totalCommands - i) * timePerCommand) - 1;
                res.write(`
                    <script>
                        document.getElementById('countdown').textContent = '${timeLeft}';
                    </script>
                `);

                let status = 'Success';
                let resultText = 'Executed';
                try {
                    let result = await pool.request().query(command);

                    res.write(`
                        <div class="grid grid-cols-12 gap-4 p-6 hover:bg-slate-700 transition-colors duration-200 animate-slide-up">
                            <div class="text-slate-300 px-6 col-span-6" title="${command}">${command}</div>
                            <div class="text-green-400 px-6 col-span-3">
                                <span class="bg-green-900 px-3 py-1 rounded">${status}</span>
                            </div>
                            <div class="text-slate-300 px-6 col-span-3">
                                <span class="font-mono bg-slate-900 px-3 py-1 rounded">${resultText}</span>
                            </div>
                        </div>
                    `);
                }
                catch (err) {
                    status = 'Failed';
                    resultText = err.message;
                    res.write(`
                        <div class="grid grid-cols-12 gap-4 p-6 hover:bg-slate-700 transition-colors duration-200 animate-slide-up">
                            <div class="text-slate-300 px-6 col-span-6" title="${command}">${command}</div>
                            <div class="text-red-400 px-6 col-span-3">
                                <span class="bg-red-900 px-3 py-1 rounded">${status}</span>
                            </div>
                            <div class="text-slate-300 px-6 col-span-3">
                                <span class="font-mono bg-slate-900 px-3 py-1 rounded">${resultText}</span>
                            </div>
                        </div>
                    `);
                }
            }

            res.write(`
                        </div>
                    </div>

                    <div class="mt-8 text-center">
                        <div class="inline-block bg-slate-800 rounded-lg p-6 shadow-lg">
                            <p class="text-slate-300 mb-2">Total Commands</p>
                            <p class="text-3xl font-bold text-white">${commands.length}</p>
                        </div>
                    </div>
                </div>
                ${req.session.visitedFromAdmin ? `
                    <script>
                        setTimeout(() => {
                            window.location.href = '/admin';
                        }, 1000);
                    </script>
                ` : ''}
                </body>
            `);

            if (req.session.visitedFromAdmin) {
                req.session.restoredData = true;
            }
            req.session.visitedFromAdmin = false;

            res.end();
        } catch (err) {
            console.dir(err);
            res.write(err.toString());
            res.end();
        }
    })();
});

module.exports = router;