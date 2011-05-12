exports.Config = {
    workspace: ".",
    ip: "127.0.0.1",
    port: 3000,
    auth: {
        backend:"auth/backends/flatfile",
        ops: {
            file: "auth.csv"
        }
    }
};