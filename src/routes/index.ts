import Route from "@Classes/Route";

export default new Route("/", "get", (req, res) => {
    res.send({
        message: "👋 Ciao from Miles",
        version: require("../../package.json").version,
        socket: process.env.SOCKET_PORT || 3001,
        polling: process.env.UPDATE_INTERVAL || 5000,
    })
})